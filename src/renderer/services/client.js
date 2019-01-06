import ApiClient from '@phantomchain/client'
import { transactionBuilder } from '@phantomchain/crypto'
import axios from 'axios'
import { castArray } from 'lodash'
import dayjs from 'dayjs'
import { V1 } from '@config'
import store from '@/store'
import eventBus from '@/plugins/event-bus'

const FIX_OFFSET = 56415597

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

  constructor (watchProfile = true) {
    this.__host = null
    this.__version = null
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
   * @return {Object[]}
   */
  async fetchDelegates ({ page, limit } = {}) {
    const network = store.getters['session/network']
    page || (page = 1)
    limit || (limit = network.constants.activeDelegates)

    let totalCount = 0
    let delegates = []

    if (this.__version === 1) {
      const { data } = await this.client.resource('delegates').all({
        offset: (page - 1) * limit,
        limit
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
      const { data } = await this.client.resource('delegates').all({ page, limit })
      delegates = data.data
      totalCount = data.meta.totalCount
    }

    return { delegates, totalCount }
  }

  /**
   * Fetches a delegate based on the given id
   * id can be public key, username (or wallet address if v2)
   *
   * @return {Object|null} Delegate object if one is found, otherwise null
   */
  async fetchDelegate (id) {
    const { data } = await this.client.resource('delegates').get(id)

    if (this.__version === 1 && data.success) {
      return data
    }
    return data.data ? data.data : null
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
      if (tx.timestamp.epoch !== 0) {
        tx.timestamp.unix -= FIX_OFFSET
      }
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
  async fetchWalletTransactions (address, { page, limit, orderBy } = {}) {
    page || (page = 1)
    limit || (limit = 50)
    orderBy || (orderBy = 'timestamp:desc')

    let totalCount = 0
    let transactions = []

    if (this.version === 1) {
      const network = store.getters['session/network']
      const { data } = await this.client.resource('transactions').all({
        recipientId: address,
        senderId: address,
        orderBy,
        offset: (page - 1) * limit,
        limit
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
        orderBy,
        limit,
        page
      })

      transactions = data.data.map(tx => {
        if (tx.timestamp.epoch !== 0) {
          tx.timestamp.unix -= FIX_OFFSET
        }
        tx.timestamp = tx.timestamp.unix * 1000 // to milliseconds
        return tx
      })
      totalCount = data.meta.totalCount
    }

    // Add some utilities for each transactions
    const result = transactions.map(tx => {
      tx.isSender = tx.sender === address
      tx.isReceiver = tx.recipient === address
      tx.totalAmount = tx.amount + tx.fee

      return tx
    })

    return {
      transactions: result,
      totalCount
    }
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
    let port = scheme === 'https://' ? 443 : 80
    if (matches[3]) {
      port = matches[3]
    }

    return {
      ip,
      port
    }
  }

  /**
   * Build a vote transaction
   * @param {Object} data
   * @param {Array} data.votes
   * @param {Number} data.fee - dynamic fee, as phantomtoshi
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
   * @param {Number} data.fee - dynamic fee, as phantomtoshi
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
   * @param {Number} data.amount - amount to send, as phantomtoshi
   * @param {Number} data.fee - dynamic fee, as phantomtoshi
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
   * @param {Number} data.fee - dynamic fee, as phantomtoshi
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
    transaction = transaction.network({
      pubKeyHash: store.getters['session/network'].version
    })

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
   * Broadcast transactions to the current peer.
   *
   * @param {Array|Object} transactions
   * @returns {Object}
   */
  async broadcastTransaction (transactions) {
    // Use p2p for v1
    if (this.__version === 1) {
      const currentPeer = store.getters['peer/current']()
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
    } else {
      const transaction = await this
        .client
        .resource('transactions')
        .create({
          transactions: castArray(transactions)
        })

      return transaction
    }
  }

  __watchProfile () {
    store.watch(
      (_, getters) => getters['session/profile'],
      (profile, oldProfile) => {
        if (!profile) return

        const currentPeer = store.getters['peer/current']()
        if (currentPeer && Object.keys(currentPeer).length > 0) {
          const scheme = currentPeer.isHttps ? 'https://' : 'http://'
          this.host = `${scheme}${currentPeer.ip}:${currentPeer.port}`
          this.version = currentPeer.version.match(/^2\./) ? 2 : 1
        } else {
          const { server, apiVersion } = store.getters['network/byId'](profile.networkId)
          this.host = server
          this.version = apiVersion
        }

        if (!oldProfile || profile.id !== oldProfile.id) {
          eventBus.emit('client:changed')
        }
      },
      { immediate: true }
    )
  }
}
