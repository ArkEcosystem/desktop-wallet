import ApiClient from '@arkecosystem/client'
import { crypto, transactionBuilder } from '@arkecosystem/crypto'
import axios from 'axios'
import { castArray, chunk, orderBy } from 'lodash'
import dayjs from 'dayjs'
import moment from 'moment'
import logger from 'electron-log'
import semver from 'semver'
import { V1 } from '@config'
import store from '@/store'
import eventBus from '@/plugins/event-bus'

export default class ClientService {
  /*
   * Normalizes the passphrase by decomposing any characters (if applicable)
   * This is mainly used for the korean language where characters are combined while the passphrase was based on the decomposed consonants
  */
  normalizePassphrase (passphrase) {
    if (passphrase) {
      return passphrase.normalize('NFD')
    }
  }

  /**
   * Fetch the network configuration according to the version.
   * Create a new client to isolate the main client.
   *
   * @param {String} server
   * @param {Number} apiVersion
   * @param {Number} timeout
   * @returns {Object}
   */
  static async fetchNetworkConfig (server, apiVersion, timeout) {
    const client = new ApiClient(server, apiVersion)
    if (timeout) {
      client.http.timeout = timeout
    }

    if (apiVersion === 1) {
      const { data } = await client.resource('loader').configuration()
      const epochData = await client.resource('blocks').epoch()
      data.network.epoch = epochData.data.epoch // TODO: data.network.constants.epoch?

      return data.network
    } else {
      const { data } = await client.resource('node').configuration()

      return data.data
    }
  }

  /**
   * Only for V2
   * Get the configuration of a peer
   * @param {String} host - URL of the host (using `core-p2p` port)
   * @param {Number} [timeout=3000]
   * @return {(Object|null)}
   */
  static async fetchPeerConfig (host, timeout = 3000) {
    try {
      const { data } = await axios({
        url: `${host}/config`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout
      })
      if (data) {
        return data.data
      }
    } catch (error) {
      // TODO only if a new feature to enable logging is added
      // console.log(`Error on \`${host}\``)
    }

    return null
  }

  static async fetchFeeStatistics (server, apiVersion, timeout) {
    if (apiVersion === 1) {
      throw new Error('Fee statistics are only available on V2 networks')
    }
    const { feeStatistics } = await ClientService.fetchNetworkConfig(server, apiVersion, timeout)
    return feeStatistics
  }

  constructor (watchProfile = true) {
    this.__host = null
    this.__version = null
    // The API version is imprecise, since new capabilities are being added continuously.
    // So, this property uses the peer version to know which features are available
    this.__capabilities = '1.0.0'
    this.client = new ApiClient('http://')

    if (watchProfile) {
      this.__watchProfile()
    }
  }

  get host () {
    return this.__host
  }

  set host (host) {
    this.__host = host
    this.client.setConnection(host)
  }

  get version () {
    return this.__version
  }

  set version (apiVersion) {
    this.__version = apiVersion
    this.client.setVersion(apiVersion)
  }

  get capabilities () {
    return this.__capabilities
  }

  set capabilities (version) {
    this.__capabilities = semver.coerce(version)
  }

  /**
   * Fetch the peer status.
   * @returns {Object}
   */
  async fetchPeerStatus () {
    if (this.__version === 1) {
      return (await this.client.resource('loader').syncing()).data
    } else {
      return (await this.client.resource('node').syncing()).data.data
    }
  }

  /** Request the delegates according to the current network version
   *
   * @param {Object} [query]
   * @param {Number} [query.page=1]
   * @param {Number} [query.limit=51]
   * @param {String} [query.orderBy='rank:asc']
   * @return {Object[]}
   */
  async fetchDelegates (options = {}) {
    const network = store.getters['session/network']
    options.page || (options.page = 1)
    options.limit || (options.limit = network.constants.activeDelegates)
    options.orderBy || (options.orderBy = 'rank:asc')

    let totalCount = 0
    let delegates = []

    if (this.__version === 1) {
      const { data } = await this.client.resource('delegates').all({
        offset: (options.page - 1) * options.limit,
        limit: options.limit,
        orderBy: options.orderBy
      })

      delegates = data.delegates.map(delegate => {
        return {
          ...delegate,
          production: {
            approval: delegate.approval,
            productivity: delegate.productivity
          },
          blocks: {
            produced: delegate.producedblocks,
            missed: delegate.missedblocks
          },
          rank: delegate.rate
        }
      })

      totalCount = parseInt(data.totalCount)
    } else {
      const { data } = await this.client.resource('delegates').all({
        page: options.page,
        limit: options.limit,
        orderBy: options.orderBy
      })
      delegates = data.data
      totalCount = data.meta.totalCount
    }

    return { delegates, totalCount }
  }

  /**
   * Fetches the voters of the given delegates and returns the number of total voters
   *
   * @return {Number}
   */
  async fetchDelegateVoters (delegate, { page, limit } = {}) {
    if (this.__version === 1) {
      const response = await this.client.resource('delegates').voters(delegate.publicKey)
      if (response.success) {
        return response.accounts.length
      }
      return 0
    }
    // v2
    const { data } = await this.client.resource('delegates').voters(delegate.username, { page, limit })
    return data.meta.totalCount
  }

  async fetchDelegateForged (delegate) {
    if (delegate.forged) {
      return delegate.forged.total
    }
    const { data } = await this.client.resource('delegates').forged(delegate.publicKey)
    if (data.success) {
      return data.forged
    }
    return 0
  }

  /**
   * Fetches the static fees for transaction types.
   * @return {Number[]}
   */
  async fetchStaticFees () {
    let fees = []
    if (this.version === 2) {
      fees = Object.values((await this.client.resource('transactions').fees()).data.data)
    } else {
      const feeData = (await this.client.resource('blocks').fees()).data.fees
      fees = [
        feeData.send,
        feeData.secondsignature,
        feeData.delegate,
        feeData.vote,
        feeData.multisignature
      ]
    }

    return fees
  }

  /**
   * Fetch the latest transactions
   *
   * NOTE: only v2
   *
   * @param {Object} [query]
   * @param {Number} [query.page=1]
   * @param {Number} [query.limit=100]
   * @return {Array}
   */
  async fetchTransactions ({ page, limit } = {}) {
    page || (page = 1)
    limit || (limit = 100)

    let totalCount = 0
    let transactions = []

    const { data } = await this.client.resource('transactions').all({
      limit,
      page
    })

    transactions = data.data.map(tx => {
      tx.timestamp = tx.timestamp.unix * 1000 // to milliseconds
      return tx
    })
    totalCount = data.meta.totalCount

    return {
      transactions,
      totalCount
    }
  }

  /**
   * Request the transactions according to the current network version
   *
   * V1:
   *   - The timestamp returned from the api is relative to the mainnet release date.
   *   - Map keys to match the v2 response structure.
   *
   * V2:
   *   - The timestamp field is an object that already returns converted date.
   *
   * @param {String} address
   * @param {Object} [query]
   * @param {Number} [query.page=1]
   * @param {Number} [query.limit=50]
   * @return {Object[]}
   */
  async fetchWalletTransactions (address, options = {}) {
    options.page || (options.page = 1)
    options.limit || (options.limit = 50)
    options.orderBy || (options.orderBy = 'timestamp:desc')

    let totalCount = 0
    let transactions = []

    if (this.version === 1) {
      const network = store.getters['session/network']
      const { data } = await this.client.resource('transactions').all({
        recipientId: address,
        senderId: address,
        orderBy: options.orderBy,
        offset: (options.page - 1) * options.limit,
        limit: options.limit
      })

      if (data.success) {
        transactions = data.transactions.map(tx => {
          tx.timestamp = dayjs(network.constants.epoch).add(tx.timestamp * 1000).valueOf()
          tx.sender = tx.senderId
          tx.recipient = tx.recipientId

          delete tx.senderId
          delete tx.recipientId

          return tx
        })
        totalCount = parseInt(data.count)
      }
    } else {
      const { data } = await this.client.resource('wallets').transactions(address, {
        orderBy: options.orderBy,
        limit: options.limit,
        page: options.page
      })

      transactions = data.data.map(tx => {
        tx.timestamp = tx.timestamp.unix * 1000 // to milliseconds
        return tx
      })
      totalCount = data.meta.totalCount
    }

    // Add some utilities for each transactions
    const result = transactions.map(tx => {
      tx.isSender = tx.sender === address
      tx.isRecipient = tx.recipient === address
      tx.totalAmount = tx.amount + tx.fee

      return tx
    })

    return {
      transactions: result,
      totalCount
    }
  }

  /**
   * Fetch transactions from a bulk list of addresses.
   * @param  {String[]} addresses
   * @param  {Object} options
   * @return {Object}
   */
  async fetchTransactionsForWallets (addresses, options = {}) {
    options = options || {}

    let walletData = {}
    if (semver.gte(this.capabilities, '2.1.0')) {
      let transactions = []
      let hadFailure = false

      for (const addressChunk of chunk(addresses, 20)) {
        try {
          const { data } = await this.client.resource('transactions').search({
            addresses: addressChunk
          })
          transactions.push(...data.data)
        } catch (error) {
          logger.error(error)
          hadFailure = true
        }
      }

      if (!hadFailure) {
        transactions = orderBy(transactions, 'timestamp', 'desc').map(transaction => {
          transaction.timestamp = transaction.timestamp.unix * 1000 // to milliseconds
          transaction.isSender = addresses.includes(transaction.sender)
          transaction.isRecipient = addresses.includes(transaction.recipient)

          return transaction
        })

        for (const transaction of transactions) {
          if (addresses.includes(transaction.sender)) {
            if (!walletData[transaction.sender]) {
              walletData[transaction.sender] = {}
            }
            walletData[transaction.sender][transaction.id] = transaction
          }

          if (transaction.recipient && addresses.includes(transaction.recipient)) {
            if (!walletData[transaction.recipient]) {
              walletData[transaction.recipient] = {}
            }
            walletData[transaction.recipient][transaction.id] = transaction
          }
        }

        for (const address of Object.keys(walletData)) {
          if (walletData[address]) {
            walletData[address] = Object.values(walletData[address])
          }
        }

        return walletData
      }
    }

    for (const address of addresses) {
      try {
        walletData[address] = (await this.fetchWalletTransactions(address, options)).transactions
      } catch (error) {
        logger.error(error)
        const message = error.response ? error.response.data.message : error.message
        if (message !== 'Wallet not found') {
          throw error
        }
      }
    }

    return walletData
  }

  /**
   * Request the data to the wallet endpoint and unify the returned value
   *
   * V1:
   * {"success":true,"account":{"address":"ANQYF8y8PBmg67hSGCA7e67d84sgm8zH3k","unconfirmedBalance":"243884095406","balance":"243884095406","publicKey":null,"unconfirmedSignature":0,"secondSignature":0,"secondPublicKey":null,"multisignatures":[],"u_multisignatures":[]}}
   *
   * V2:
   * {"address":"DPFPtDfexMrSiZEB1o3TiJTUYBnnHrzFrD","publicKey":null,"secondPublicKey":null,"balance":1,"isDelegate":false}
   *
   * @param {String} address
   * @return {Object}
   */
  async fetchWallet (address) {
    let walletData = null

    if (this.version === 2) {
      const { data } = await this.client.resource('wallets').get(address)
      walletData = data.data
    } else {
      const { data } = await this.client.resource('accounts').get(address)
      if (data.success) {
        const { account } = data
        walletData = account
        delete walletData.unconfirmedBalance
        delete walletData.unconfirmedSignature
        delete walletData.secondSignature
        delete walletData.multisignatures
        delete walletData.u_multisignatures

        const delegate = await store.getters['delegate/byAddress'](walletData.address)
        walletData.isDelegate = false
        if (delegate) {
          walletData.isDelegate = true
          walletData.username = delegate.username
        }
      }
    }

    if (walletData) {
      walletData.balance = parseInt(walletData.balance)
    }

    return walletData
  }

  /**
   * Fetches wallet data from a bulk list of addresses.
   * @param  {String[]} addresses
   * @return {Object[]}
   */
  async fetchWallets (addresses) {
    let walletData = []

    if (semver.gte(this.capabilities, '2.1.0')) {
      for (const addressChunk of chunk(addresses, 20)) {
        const { data } = await this.client.resource('wallets').search({
          addresses: addressChunk
        })
        walletData.push(...data.data)
      }
    } else {
      for (const address of addresses) {
        try {
          walletData.push(await this.fetchWallet(address))
        } catch (error) {
          logger.error(error)
          const message = error.response ? error.response.data.message : error.message
          if (message !== 'Wallet not found') {
            throw error
          }
        }
      }
    }

    return walletData
  }

  /**
   * Request the vote of a wallet.
   * Returns the delegate's public key if this wallet has voted.
   * @param {String} address
   * @returns {String|null}
   */
  async fetchWalletVote (address) {
    let delegatePublicKey = null

    if (this.version === 2) {
      const { data } = await this.client.resource('wallets').votes(address)
      const response = data.data

      if (response.length) {
        const lastVote = response[0].asset.votes[0]

        // If the last vote was a unvote leave the pubkey null
        if (lastVote.charAt(0) === '-') return

        delegatePublicKey = response[0].asset.votes[0].substring(1)
      }
    } else {
      const { data } = await this.client.resource('accounts').delegates(address)
      if (data.success && data.delegates.length) {
        delegatePublicKey = data.delegates[0].publicKey
      }
    }

    return delegatePublicKey
  }

  /**
   * Request peer list.
   * @param {String} network
   * @param {Object[]} [peers=[]]
   * @returns {Object[]}
   */
  async fetchPeers (network, peers = []) {
    if (network) {
      peers = null
    } else if (!network && !peers.length) {
      peers = [this.__parseCurrentPeer()]
    }

    return ApiClient.findPeers(network, this.client.version, peers)
  }

  /**
   * Parse peer from current client host.
   * @return {Object}
   */
  __parseCurrentPeer () {
    const matches = /(https?:\/\/)([a-zA-Z0-9.-_]+):([0-9]+)/.exec(this.client.http.host)
    const scheme = matches[1]
    const ip = matches[2]
    const isHttps = scheme === 'https://'
    let port = isHttps ? 443 : 80
    if (matches[3]) {
      port = matches[3]
    }

    return {
      ip,
      port,
      isHttps
    }
  }

  /**
   * Build a vote transaction
   * @param {Object} data
   * @param {Array} data.votes
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildVote ({ votes, fee, passphrase, secondPassphrase, wif }, isAdvancedFee = false, returnObject = false) {
    if (!isAdvancedFee && fee > V1.fees[3]) {
      throw new Error(`Vote fee should be smaller than ${V1.fees[3]}`)
    }

    const transaction = transactionBuilder
      .vote()
      .votesAsset(votes)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      secondPassphrase,
      wif
    }, returnObject)
  }

  /**
   * Build a delegate registration transaction
   * @param {Object} data
   * @param {String} data.username
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildDelegateRegistration ({ username, fee, passphrase, secondPassphrase, wif }, isAdvancedFee = false, returnObject = false) {
    if (!isAdvancedFee && fee > V1.fees[2]) {
      throw new Error(`Delegate registration fee should be smaller than ${V1.fees[2]}`)
    }

    const transaction = transactionBuilder
      .delegateRegistration()
      .usernameAsset(username)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      secondPassphrase,
      wif
    }, returnObject)
  }

  /**
   * Build a transfer transaction.
   * @param {Object} data
   * @param {Number} data.amount - amount to send, as arktoshi
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.recipientId
   * @param {String} data.vendorField
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildTransfer ({ amount, fee, recipientId, vendorField, passphrase, secondPassphrase, wif }, isAdvancedFee = false, returnObject = false) {
    // To ensure that transfers cannot be build with a bigger fee than V1
    if (!isAdvancedFee && fee > V1.fees[0]) {
      throw new Error(`Transfer fee should be smaller than ${V1.fees[0]}`)
    }

    const transaction = transactionBuilder
      .transfer()
      .amount(amount)
      .fee(fee)
      .recipientId(recipientId)
      .vendorField(vendorField)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      secondPassphrase,
      wif
    }, returnObject)
  }

  /**
   * Build a second signature registration transaction.
   * @param {Object} data
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildSecondSignatureRegistration ({ fee, passphrase, secondPassphrase, wif }, isAdvancedFee = false, returnObject = false) {
    if (!isAdvancedFee && fee > V1.fees[1]) {
      throw new Error(`Second signature fee should be smaller than ${V1.fees[1]}`)
    }

    const transaction = transactionBuilder
      .secondSignature()
      .signatureAsset(secondPassphrase)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      wif
    }, returnObject)
  }

  /**
   * Signs a transaction
   * @param {Object} data
   * @param {Object} data.transaction
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  __signTransaction ({ transaction, passphrase, secondPassphrase, wif }, returnObject = false) {
    const network = store.getters['session/network']
    transaction = transaction.network({
      pubKeyHash: network.version
    })

    // TODO replace with dayjs
    const epochTime = moment(network.constants.epoch).utc().valueOf()
    const now = moment().valueOf()
    transaction.data.timestamp = Math.floor((now - epochTime) / 1000)

    if (passphrase) {
      transaction = transaction.sign(this.normalizePassphrase(passphrase))
    } else if (wif) {
      transaction = transaction.signWithWif(wif)
    }

    if (secondPassphrase) {
      transaction = transaction.secondSign(this.normalizePassphrase(secondPassphrase))
    }

    return returnObject ? transaction : transaction.getStruct()
  }

  /**
   * Helper function to send a transaction on a v1 network. Uses p2p
   * @param {Object} transactions - the transactions to send
   * @param {Object} currentPeer - the peer to use
   * @returns {Object} the response of sending the transaction
   */
  async __sendV1Transaction (transactions, currentPeer) {
    const scheme = currentPeer.isHttps ? 'https://' : 'http://'
    const host = `${scheme}${currentPeer.ip}:${currentPeer.port}/peer/transactions`
    const network = store.getters['session/network']
    const response = await axios({
      url: host,
      data: { transactions: castArray(transactions) },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        version: '1.6.1',
        port: 1,
        nethash: network.nethash
      }
    })
    return response
  }

  /**
   * Broadcast transactions to the current peer.
   *
   * @param {Array|Object} transactions
   * @param {Boolean} broadcast - whether the transaction should be broadcasted to multiple peers or not
   * @returns {Object[]}
   */
  async broadcastTransaction (transactions, broadcast) {
    let currentPeer = store.getters['peer/current']()
    if (!currentPeer) {
      currentPeer = this.__parseCurrentPeer()
    }
    // Use p2p for v1
    if (this.__version === 1) {
      if (broadcast) {
        let responses = []
        let peers = store.getters['peer/broadcastPeers']()
        if ((!peers || !peers.length) || currentPeer) {
          peers = [currentPeer]
        }

        for (let i = 0; i < peers.length; i++) {
          const response = await this.__sendV1Transaction(transactions, peers[i])
          responses.push(response)
        }
        return responses
      } else {
        const response = await this.__sendV1Transaction(transactions, currentPeer)
        return [response]
      }
    } else {
      let failedBroadcast = false
      if (broadcast) {
        let txs = []
        let peers = store.getters['peer/broadcastPeers']()
        if (peers && peers.length) {
          for (let i = 0; i < peers.length; i++) {
            try {
              const client = await store.dispatch('peer/clientServiceFromPeer', peers[i])
              const tx = await client.client.resource('transactions').create({ transactions: castArray(transactions) })
              txs.push(tx)
            } catch (err) {
              //
            }
          }
          return txs
        } else {
          failedBroadcast = true
        }
      }

      if (!broadcast || failedBroadcast) {
        const transaction = await this
          .client
          .resource('transactions')
          .create({
            transactions: castArray(transactions)
          })
        return [transaction]
      }
    }
  }

  // TODO this shouldn't be responsibility of the client
  // TODO update client when peer changes
  __watchProfile () {
    store.watch(
      (_, getters) => getters['session/profile'],
      async (profile, oldProfile) => {
        if (!profile) {
          return
        }

        const network = store.getters['network/byId'](profile.networkId)
        const currentPeer = store.getters['peer/current']()

        if (currentPeer && currentPeer.ip) {
          const scheme = currentPeer.isHttps ? 'https://' : 'http://'
          this.host = `${scheme}${currentPeer.ip}:${currentPeer.port}`
          this.version = currentPeer.version.match(/^2\./) ? 2 : 1
          this.capabilities = currentPeer.version

        // TODO if we could use the server from network, then, it is a peer and this shouldn't be necessary
        } else {
          let { server, apiVersion } = network
          this.host = server
          this.version = apiVersion

          // Infer which are the real capabilities of the peer
          if (apiVersion === 2) {
            try {
              const testAddress = crypto.getAddress(crypto.getKeys('test').publicKey, network.version)
              const { address } = this.client.resource('wallets').search({
                addresses: [testAddress]
              })

              apiVersion = (address === testAddress) ? '2.1.0' : '2.0.0'
            } catch (_) {
              // The peer does not have capability to search for multiple wallets or transactions at once
            }
          }

          this.capabilities = apiVersion
        }

        if (!oldProfile || profile.id !== oldProfile.id) {
          eventBus.emit('client:changed')
        }
      },
      { immediate: true }
    )
  }
}
