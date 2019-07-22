import { Connection } from '@arkecosystem/client'
import { crypto, transactionBuilder } from '@arkecosystem/crypto'
import { castArray, chunk, orderBy } from 'lodash'
import got from 'got'
import moment from 'moment'
import logger from 'electron-log'
import semver from 'semver'
import { V1 } from '@config'
import store from '@/store'
import eventBus from '@/plugins/event-bus'
import BigNumber from '@/plugins/bignumber'

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
   * In case the `vendorField` length has changed, updates the network data.
   * Create a new client to isolate the main client.
   *
   * @param {String} server
   * @param {Number} apiVersion
   * @param {Number} timeout
   * @returns {Object}
   */
  static async fetchNetworkConfig (server, timeout) {
    const client = (new Connection(`${server}/api/v2`)).withOptions({ timeout: timeout || 5000 })

    const response = await client.api('node').configuration()
    const data = response.body.data

    const currentNetwork = store.getters['session/network']
    if (currentNetwork.nethash === data.nethash) {
      const newLength = data.constants.vendorFieldLength

      if (newLength && (!currentNetwork.vendorField || newLength !== currentNetwork.vendorField.maxLength)) {
        currentNetwork.vendorField = {
          maxLength: newLength
        }

        await store.dispatch('network/update', currentNetwork)
      }
    }

    return data
  }

  /**
   * TODO: Remove unnecessary endpoints once core 2.4 is released (maybe wait until 2.5 so other chains have updated)
   * Only for V2
   * Get the configuration of a peer
   * @param {String} host - URL of the host (using `core-p2p` port)
   * @param {Number} [timeout=3000]
   * @return {(Object|null)}
   */
  static async fetchPeerConfig (host, timeout = 3000) {
    const walletApiHost = host.replace(/:\d+/, ':4040')
    const endpoints = [
      `${walletApiHost}/config`,
      `${host}/config`,
      walletApiHost
    ]

    for (const endpoint of endpoints) {
      try {
        const { body } = await got(endpoint, {
          json: true,
          timeout
        })

        if (body) {
          return body.data
        }
      } catch (error) {
        // TODO only if a new feature to enable logging is added
        // console.log(`Error on \`${host}\``)
      }
    }

    return null
  }

  static async fetchFeeStatistics (server, timeout) {
    try {
      const client = (new Connection(`${server}/api/v2`)).withOptions({ timeout: timeout || 5000 })
      const { body } = await client.api('node').fees(7)

      return body.data.map(fee => ({
        type: Number(fee.type),
        fees: {
          minFee: Number(fee.min),
          maxFee: Number(fee.max),
          avgFee: Number(fee.avg)
        }
      }))
    } catch (error) {
      const { feeStatistics } = await ClientService.fetchNetworkConfig(server, timeout)

      return feeStatistics
    }
  }

  constructor (watchProfile = true) {
    this.__host = null
    // The API version is imprecise, since new capabilities are being added continuously.
    // So, this property uses the peer version to know which features are available
    this.__capabilities = '2.0.0'
    this.client = new Connection('http://localhost')

    if (watchProfile) {
      this.__watchProfile()
    }
  }

  get host () {
    return this.__host
  }

  set host (host) {
    host = `${host}/api/v2`
    console.log('new host', host)
    this.__host = host
    this.client = (new Connection(host)).withOptions({ timeout: 5000 })
  }

  get version () {
    return this.__version
  }

  get capabilities () {
    return this.__capabilities
  }

  set capabilities (version) {
    this.__capabilities = semver.coerce(version)
  }

  isCapable (version) {
    return semver.gte(this.capabilities, version)
  }

  /**
   * Fetch the peer status.
   * @returns {Object}
   */
  async fetchPeerStatus () {
    return (await this.client.api('node').syncing()).body.data
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

    const { body } = await this.client.api('delegates').all({
      page: options.page,
      limit: options.limit,
      orderBy: options.orderBy
    })

    return {
      delegates: body.data,
      totalCount: body.meta.totalCount
    }
  }

  /**
   * Fetches the voters of the given delegates and returns the number of total voters
   *
   * @return {Number}
   */
  async fetchDelegateVoters (delegate, { page, limit } = {}) {
    const { body } = await this.client.api('delegates').voters(delegate.username, { page, limit })

    return body.meta.totalCount
  }

  async fetchDelegateForged (delegate) {
    if (delegate.forged) {
      return delegate.forged.total
    }

    const { body } = await this.client.api('delegates').forged(delegate.publicKey)

    if (body.success) {
      return body.forged
    }

    return '0'
  }

  /**
   * Fetches the static fees for transaction types.
   * @return {Number[]}
   */
  async fetchStaticFees () {
    const fees = Object.values((await this.client.api('transactions').fees()).body.data)

    return fees
  }

  /**
   * Fetch the latest transactions
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

    const { body } = await this.client.api('transactions').all({
      limit,
      page
    })

    transactions = body.data.map(transaction => {
      transaction.timestamp = transaction.timestamp.unix * 1000 // to milliseconds
      return transaction
    })
    totalCount = body.meta.totalCount

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

    const { body } = await this.client.api('wallets').transactions(address, {
      orderBy: options.orderBy,
      limit: options.limit,
      page: options.page
    })

    transactions = body.data.map(transaction => {
      transaction.timestamp = transaction.timestamp.unix * 1000 // to milliseconds
      return transaction
    })
    totalCount = body.meta.totalCount

    // Add some utilities for each transactions
    const result = transactions.map(transaction => {
      transaction.isSender = transaction.sender === address
      transaction.isRecipient = transaction.recipient === address
      transaction.totalAmount = new BigNumber(transaction.amount).plus(transaction.fee)

      return transaction
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
    if (this.isCapable('2.1.0')) {
      let transactions = []
      let hadFailure = false

      for (const addressChunk of chunk(addresses, 20)) {
        try {
          const { body } = await this.client.api('transactions').search({
            addresses: addressChunk
          })
          transactions.push(...body.data)
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
        const message = error.response ? error.response.body.message : error.message
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
    const { body } = await this.client.api('wallets').get(address)
    const walletData = body.data

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

    if (this.isCapable('2.1.0')) {
      for (const addressChunk of chunk(addresses, 20)) {
        const { body } = await this.client.api('wallets').search({
          addresses: addressChunk
        })
        walletData.push(...body.data)
      }
    } else {
      for (const address of addresses) {
        try {
          walletData.push(await this.fetchWallet(address))
        } catch (error) {
          logger.error(error)
          const message = error.response ? error.response.body.message : error.message
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

    const { body } = await this.client.api('wallets').votes(address)
    const response = body.data

    if (response.length) {
      const lastVote = response[0].asset.votes[0]

      // If the last vote was a unvote leave the pubkey null
      if (lastVote.charAt(0) === '-') {
        return
      }

      delegatePublicKey = response[0].asset.votes[0].substring(1)
    }

    return delegatePublicKey
  }

  /**
   * Parse peer from current client host.
   * @return {Object}
   */
  __parseCurrentPeer () {
    const matches = /(https?:\/\/)([a-zA-Z0-9.-_]+):([0-9]+)/.exec(this.host)
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
  async buildVote ({ votes, fee, passphrase, secondPassphrase, wif, networkWif }, isAdvancedFee = false, returnObject = false) {
    const staticFee = store.getters['transaction/staticFee'](3) || V1.fees[3]
    if (!isAdvancedFee && fee > staticFee) {
      throw new Error(`Vote fee should be smaller than ${staticFee}`)
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
      wif,
      networkWif
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
  async buildDelegateRegistration ({ username, fee, passphrase, secondPassphrase, wif, networkWif }, isAdvancedFee = false, returnObject = false) {
    const staticFee = store.getters['transaction/staticFee'](2) || V1.fees[2]
    if (!isAdvancedFee && fee > staticFee) {
      throw new Error(`Delegate registration fee should be smaller than ${staticFee}`)
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
      wif,
      networkWif
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
  async buildTransfer ({ amount, fee, recipientId, vendorField, passphrase, secondPassphrase, wif, networkWif }, isAdvancedFee = false, returnObject = false) {
    const staticFee = store.getters['transaction/staticFee'](0) || V1.fees[0]
    if (!isAdvancedFee && fee > staticFee) {
      throw new Error(`Transfer fee should be smaller than ${staticFee}`)
    }

    const transaction = transactionBuilder
      .transfer()
      .amount(amount)
      .fee(fee)
      .recipientId(recipientId)

    transaction.data.vendorField = vendorField

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif
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
  async buildSecondSignatureRegistration ({ fee, passphrase, secondPassphrase, wif, networkWif }, isAdvancedFee = false, returnObject = false) {
    const staticFee = store.getters['transaction/staticFee'](1) || V1.fees[1]
    if (!isAdvancedFee && fee > staticFee) {
      throw new Error(`Second signature fee should be smaller than ${staticFee}`)
    }

    const transaction = transactionBuilder
      .secondSignature()
      .signatureAsset(secondPassphrase)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)

    return this.__signTransaction({
      transaction,
      passphrase,
      wif,
      networkWif
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
  __signTransaction ({ transaction, passphrase, secondPassphrase, wif, networkWif }, returnObject = false) {
    const network = store.getters['session/network']
    transaction = transaction.network(network.version)

    // TODO replace with dayjs
    const epochTime = moment(network.constants.epoch).utc().valueOf()
    const now = moment().valueOf()
    transaction.data.timestamp = Math.floor((now - epochTime) / 1000)

    if (passphrase) {
      transaction = transaction.sign(this.normalizePassphrase(passphrase))
    } else if (wif) {
      transaction = transaction.signWithWif(wif, networkWif)
    }

    if (secondPassphrase) {
      transaction = transaction.secondSign(this.normalizePassphrase(secondPassphrase))
    }

    return returnObject ? transaction : transaction.getStruct()
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

    console.log('broadcastTransaction currentPeer', currentPeer)

    let failedBroadcast = false
    if (broadcast) {
      let txs = []
      let peers = store.getters['peer/broadcastPeers']()
      if (peers && peers.length) {
        for (let i = 0; i < peers.length; i++) {
          try {
            const client = await store.dispatch('peer/clientServiceFromPeer', peers[i])
            console.log(client)
            const transaction = await client.client.api('transactions').create({
              transactions: castArray(transactions)
            })
            console.log('broadcastTransaction transaction', transaction)
            txs.push(transaction)
          } catch (err) {
            console.log('broadcastTransaction error', err)
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
        .api('transactions')
        .create({
          transactions: castArray(transactions)
        })
      return [transaction]
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
          this.capabilities = currentPeer.version

        // TODO if we could use the server from network, then, it is a peer and this shouldn't be necessary
        } else {
          let { server, apiVersion } = network
          this.host = server

          // Infer which are the real capabilities of the peer
          try {
            const testAddress = crypto.getAddress(crypto.getKeys('test').publicKey, network.version)
            const { address } = this.client.api('wallets').search({
              addresses: [testAddress]
            })

            apiVersion = (address === testAddress) ? '2.1.0' : '2.0.0'
          } catch (_) {
            // The peer does not have capability to search for multiple wallets or transactions at once
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
