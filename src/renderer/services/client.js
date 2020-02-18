import { Connection } from '@arkecosystem/client'
import { Identities, Transactions } from '@arkecosystem/crypto'
import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto'
import { castArray, chunk, cloneDeep, orderBy } from 'lodash'
import moment from 'moment'
import logger from 'electron-log'
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import store from '@/store'
import eventBus from '@/plugins/event-bus'
import BigNumber from '@/plugins/bignumber'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BusinessRegistrationTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BusinessResignationTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BusinessUpdateTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BridgechainRegistrationTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BridgechainResignationTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BridgechainUpdateTransaction)

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
   * Generate a new connection instance.
   *
   * @param  {String} server         Host URL to connect to server
   * @param  {Number} [timeout=5000] Connection timeout
   * @return {Connection}
   */
  static newConnection (server, timeout) {
    return (new Connection(`${server}/api/v2`)).withOptions({ timeout: timeout || 5000 })
  }

  /**
   * Fetch the network configuration according to the version.
   * In case the `vendorField` length has changed, updates the network data.
   * Create a new client to isolate the main client.
   *
   * @param {String} server
   * @param {Number} timeout
   * @returns {Object}
   */
  static async fetchNetworkConfig (server, timeout) {
    const response = await ClientService.newConnection(server, timeout).api('node').configuration()
    const data = response.body.data

    const currentNetwork = store.getters['session/network']
    if (currentNetwork && currentNetwork.nethash === data.nethash) {
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
   * Fetch the network crypto data, e.g. milestones
   *
   * @param {String} server
   * @param {Number} timeout
   * @returns {Object}
   */
  static async fetchNetworkCrypto (server, timeout) {
    return (await ClientService.newConnection(server, timeout).api('node').crypto()).body.data
  }

  static async fetchFeeStatistics (server, timeout) {
    try {
      const { body } = await ClientService.newConnection(server, timeout).api('node').fees(7)

      if (!body.data[0]) {
        return Object.values(TRANSACTION_GROUPS)
          .filter(group => !!body.data[group])
          .reduce((accumulator, group) => {
            accumulator[group] = Object.keys(body.data[group])
              .map(key => {
                const fee = body.data[group][key]

                return {
                  type: TRANSACTION_TYPES[`GROUP_${group}`][key.toUpperCase()],
                  fees: {
                    minFee: Number(fee.min),
                    maxFee: Number(fee.max),
                    avgFee: Number(fee.avg)
                  }
                }
              })

            return accumulator
          }, {})
      }

      return body.data.map(fee => ({
        type: Number(fee.type),
        fees: {
          minFee: Number(fee.min),
          maxFee: Number(fee.max),
          avgFee: Number(fee.avg)
        }
      }))
    } catch (error) {
      return []
    }
  }

  constructor (watchProfile = true) {
    this.__host = null
    this.client = new Connection('http://localhost')

    if (watchProfile) {
      this.__watchProfile()
    }
  }

  get host () {
    return this.__host
  }

  set host (host) {
    this.__host = `${host}/api/v2`
    this.client = ClientService.newConnection(host)
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

  fetchDelegateForged (delegate) {
    if (delegate.forged) {
      return delegate.forged.total
    }

    return '0'
  }

  /**
   * Fetches the static fees for transaction types.
   * @return {Number[]}
   */
  async fetchStaticFees () {
    const fees = (await this.client.api('transactions').fees()).body.data

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
   * Fetch bridgechains for a business.
   * @param  {String} publicKey
   * @return {Object}
   */
  async fetchBusinessBridgechains (publicKey) {
    return (await this.client.api('businesses').bridgechains(publicKey)).body
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

    const queryOptions = {
      orderBy: options.orderBy,
      limit: options.limit,
      page: options.page
    }

    if (options.transactionType) {
      queryOptions.type = options.transactionType
    }

    const { body } = await this.client.api('wallets').transactions(address, queryOptions)

    transactions = body.data.map(transaction => {
      transaction.timestamp = transaction.timestamp.unix * 1000 // to milliseconds
      return transaction
    })

    store.dispatch('transaction/processVotes', transactions)
    totalCount = body.meta.totalCount

    // Add some utilities for each transactions
    const result = transactions.map(transaction => {
      transaction.isSender = transaction.sender === address
      transaction.isRecipient = transaction.recipient === address
      transaction.totalAmount = TransactionService.getTotalAmount(transaction)

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

    const walletData = {}
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

        if (transaction.asset && transaction.asset.payments) {
          for (const payment of transaction.asset.payments) {
            if (addresses.includes(payment.recipientId)) {
              if (!walletData[payment.recipientId]) {
                walletData[payment.recipientId] = {}
              }
              walletData[payment.recipientId][transaction.id] = transaction
            }
          }
        }
      }

      for (const address of Object.keys(walletData)) {
        if (walletData[address]) {
          walletData[address] = Object.values(walletData[address])
        }
      }

      return walletData
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
   * Fetches wallet data from an address.
   * @param {String} address
   * @return {Object}
   */
  async fetchWallet (address) {
    const { body } = await this.client.api('wallets').get(address)
    return body.data
  }

  /**
   * Fetches wallet data from a bulk list of addresses.
   * @param  {String[]} addresses
   * @return {Object[]}
   */
  async fetchWallets (addresses) {
    const walletData = []

    for (const addressChunk of chunk(addresses, 20)) {
      const { body } = await this.client.api('wallets').search({
        addresses: addressChunk
      })
      walletData.push(...body.data)
    }

    return walletData
  }

  /**
   * Request the vote of a wallet.
   * Returns the delegate's public key if this wallet has voted, null otherwise.
   * @param {String} address
   * @returns {String|null}
   */
  async fetchWalletVote (address) {
    let walletData

    try {
      walletData = await this.fetchWallet(address)
    } catch (error) {
      logger.error(error)
      const message = error.response ? error.response.body.message : error.message
      if (message !== 'Wallet not found') {
        throw error
      }
    }

    if (walletData) {
      return walletData.vote || null
    }

    return null
  }

  /**
   * Fetch votes for wallet.
   *
   * @param {String} address
   * @returns {Object[]}
   */
  async fetchWalletVotes (address) {
    return (await this.client.api('wallets').votes(address)).body.data
  }

  /**
   * Parse peer from current client host.
   * @return {Object}
   */
  __parseCurrentPeer () {
    const matches = /(https?:\/\/)([a-zA-Z0-9.\-_]+)(:([0-9]*))?/.exec(this.host)
    const scheme = matches[1]
    const ip = matches[2]
    const port = matches[4]

    const isHttps = scheme === 'https://'

    return {
      ip,
      port: port || (isHttps ? '443' : '80'),
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
  async buildVote (
    {
      address,
      votes,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.VOTE, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Vote fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .vote()
      .votesAsset(votes)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
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
  async buildDelegateRegistration (
    {
      address,
      username,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Delegate registration fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .delegateRegistration()
      .usernameAsset(username)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
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
  async buildTransfer (
    {
      address,
      amount,
      fee,
      recipientId,
      vendorField,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      networkId,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.TRANSFER, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Transfer fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .transfer()
      .amount(amount || 0)
      .fee(fee)
      .recipientId(recipientId)
      .vendorField(vendorField)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      networkId,
      multiSignature
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
  async buildSecondSignatureRegistration (
    {
      address,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Second signature fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .secondSignature()
      .signatureAsset(secondPassphrase)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build Multi-Signature transaction.
   * @param {Object} data
   * @param {Number} data.publicKeys - public keys associated with new multisignature wallet
   * @param {Number} data.minKeys - minimum required keys for wallet transactions
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildMultiSignature (
    {
      address,
      publicKeys,
      minKeys,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Multi-Signature fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .multiSignature()
      .multiSignatureAsset({
        min: +minKeys,
        publicKeys
      })
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    const transactionObject = await this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature: transaction.data.asset.multiSignature
    }, true)

    return returnObject ? transactionObject : transactionObject.getStruct()
  }

  /**
   * Build IPFS transaction.
   * @param {Object} data
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {Number} data.hash - ipfs hash
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildIpfs (
    {
      address,
      fee,
      hash,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.IPFS, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`IPFS fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .ipfs()
      .ipfsAsset(hash)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a multi-payment transfer transaction.
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
  async buildMultiPayment (
    {
      address,
      recipients,
      fee,
      vendorField,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Multi-Payment fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .multiPayment()
      .recipientId(address)
      .fee(fee)
      .vendorField(vendorField)

    for (const recipient of recipients) {
      transaction.addPayment(recipient.address, recipient.amount)
    }

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a delegate resignation transaction.
   * @param {Object} data
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildDelegateResignation (
    {
      address,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION, 1)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Delegate resignation fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory
      .delegateResignation()
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a business registration transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {Object} data.asset
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBusinessRegistration (
    {
      address,
      fee,
      asset,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Business Registration fee should be smaller than ${staticFee}`)
    }

    const businessRegistrationAsset = {
      name: asset.name,
      website: asset.website
    }

    if (asset.vat && asset.vat.length) {
      businessRegistrationAsset.vat = asset.vat
    }

    if (asset.repository && asset.repository.length) {
      businessRegistrationAsset.repository = asset.repository
    }

    const transaction = new MagistrateCrypto.Builders.BusinessRegistrationBuilder()
      .businessRegistrationAsset(businessRegistrationAsset)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a business update transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {Object} data.asset
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBusinessUpdate (
    {
      address,
      fee,
      asset,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Business Update fee should be smaller than ${staticFee}`)
    }

    const businessAsset = {
      name: asset.name,
      website: asset.website
    }

    if (asset.vat && asset.vat.length) {
      businessAsset.vat = asset.vat
    }

    if (asset.repository && asset.repository.length) {
      businessAsset.repository = asset.repository
    }

    const transaction = new MagistrateCrypto.Builders.BusinessUpdateBuilder()
      .businessUpdateAsset(businessAsset)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a business resignation transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBusinessResignation (
    {
      address,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Business Resignation fee should be smaller than ${staticFee}`)
    }

    const transaction = new MagistrateCrypto.Builders.BusinessResignationBuilder()
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a bridgechain registration transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {Object} data.asset
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBridgechainRegistration (
    {
      address,
      fee,
      asset,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Bridgechain Registration fee should be smaller than ${staticFee}`)
    }

    const transaction = new MagistrateCrypto.Builders.BridgechainRegistrationBuilder()
      .bridgechainRegistrationAsset(asset)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a bridgechain update transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {Object} data.asset
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBridgechainUpdate (
    {
      address,
      fee,
      asset,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Bridgechain Update fee should be smaller than ${staticFee}`)
    }

    const transaction = new MagistrateCrypto.Builders.BridgechainUpdateBuilder()
      .bridgechainUpdateAsset(asset)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Build a bridgechain resignation transaction.
   * @param {Object} data
   * @param {String} data.address
   * @param {Number} data.fee - dynamic fee, as arktoshi
   * @param {String} data.bridgechainId
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {Object} data.multiSignature
   * @param {Boolean} isAdvancedFee - if it's not a static fee
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async buildBridgechainResignation (
    {
      address,
      fee,
      bridgechainId,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION, 2)
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Bridgechain Resignation fee should be smaller than ${staticFee}`)
    }

    const transaction = new MagistrateCrypto.Builders.BridgechainResignationBuilder()
      .bridgechainResignationAsset(bridgechainId)
      .fee(fee)

    passphrase = this.normalizePassphrase(passphrase)
    secondPassphrase = this.normalizePassphrase(secondPassphrase)

    return this.__signTransaction({
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature
    }, returnObject)
  }

  /**
   * Signs a transaction
   * @param {Object} data
   * @param {Object} data.transaction
   * @param {String} data.passphrase
   * @param {String} data.secondPassphrase
   * @param {String} data.wif
   * @param {String} data.networkWif
   * @param {String} data.networkId
   * @param {Boolean} returnObject - to return the transaction of its internal struct
   * @returns {Object}
   */
  async __signTransaction (
    {
      address,
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      networkId,
      multiSignature
    },
    returnObject = false
  ) {
    let network
    if (networkId) {
      network = store.getters['network/byId'](networkId)
    }
    if (!network) {
      network = store.getters['session/network']
    }

    transaction = transaction.network(network.version)

    // TODO replace with dayjs
    const epochTime = moment(network.constants.epoch).utc().valueOf()
    const now = moment().valueOf()
    transaction.data.timestamp = Math.floor((now - epochTime) / 1000)

    if (passphrase) {
      passphrase = this.normalizePassphrase(passphrase)
    }

    if (network.constants.aip11) {
      let nonce = '1'
      try {
        nonce = BigNumber((await this.fetchWallet(address)).nonce || 0).plus(1).toString()
      } catch (error) {
        //
      }

      transaction.version(2)
        .nonce(nonce)
    } else {
      transaction.version(1)
    }

    if (multiSignature) {
      let senderPublicKey = null
      if (passphrase) {
        senderPublicKey = WalletService.getPublicKeyFromPassphrase(passphrase)
      } else if (wif) {
        senderPublicKey = WalletService.getPublicKeyFromWIF(wif)
      }

      const publicKeyIndex = multiSignature.publicKeys.indexOf(senderPublicKey)
      transaction.senderPublicKey(senderPublicKey)
      if (publicKeyIndex > -1) {
        if (passphrase) {
          transaction.multiSign(passphrase, publicKeyIndex)
        } else if (wif) {
          transaction.multiSignWithWif(publicKeyIndex, wif, networkWif)
        }
      } else if (transaction.data.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE && !transaction.data.signatures) {
        transaction.data.signatures = []
      }
    } else {
      if (passphrase) {
        transaction.sign(passphrase)
      } else if (wif) {
        transaction.signWithWif(wif, networkWif)
      }

      if (secondPassphrase) {
        transaction.secondSign(this.normalizePassphrase(secondPassphrase))
      }
    }

    if (returnObject) {
      return transaction
    }

    if (multiSignature) {
      if (!transaction.data.senderPublicKey) {
        transaction.senderPublicKey(WalletService.getPublicKeyFromMultiSignatureAsset(multiSignature))
      }
      const transactionJson = transaction.build().toJson()
      transactionJson.multiSignature = multiSignature
      if (!transactionJson.signatures) {
        transactionJson.signatures = []
      }

      return transactionJson
    }

    const response = transaction.build().toJson()
    response.totalAmount = TransactionService.getTotalAmount(response)

    return response
  }

  /**
   * Sign a transaction that requires multi-signatures
   * @return {Object}
   */
  async multiSign (transaction, { multiSignature, networkWif, passphrase, secondPassphrase, wif }) {
    if (!passphrase && !wif) {
      throw new Error('No passphrase or wif provided')
    }

    transaction = this.__transactionFromData(transaction)

    const network = store.getters['session/network']
    if (!network.constants.aip11) {
      throw new Error('Multi-Signature Transactions are not supported yet')
    }

    let keys
    if (passphrase) {
      keys = Identities.Keys.fromPassphrase(passphrase)
    } else {
      keys = Identities.Keys.fromWIF(wif, { wif: networkWif })
    }

    const isReady = TransactionService.isMultiSignatureReady({
      ...transaction,
      multiSignature,
      signatures: [
        ...transaction.signatures
      ]
    }, true)

    if (!isReady) {
      const index = multiSignature.publicKeys.indexOf(keys.publicKey)
      if (index >= 0) {
        Transactions.Signer.multiSign(transaction, keys, index)
        transaction.signatures = transaction.signatures.filter((value, index, self) => {
          return self.indexOf(value) === index
        })
      } else {
        throw new Error('passphrase/wif is not used to sign this transaction')
      }
    } else if (TransactionService.needsWalletSignature(transaction, keys.publicKey)) {
      Transactions.Signer.sign(transaction, keys)

      if (secondPassphrase) {
        const secondaryKeys = Identities.Keys.fromPassphrase(secondPassphrase)
        Transactions.Signer.secondSign(transaction, secondaryKeys)
      }

      transaction.id = TransactionService.getId(transaction)
    }

    return {
      ...transaction,
      multiSignature
    }
  }

  __transactionFromData (transaction) {
    transaction = cloneDeep(transaction)
    transaction.multiSignature = undefined
    transaction.timestamp = undefined

    return transaction
  }

  /**
   * Broadcast transactions to the current peer.
   *
   * @param {Array|Object} transactions
   * @param {Boolean} broadcast - whether the transaction should be broadcasted to multiple peers or not
   * @returns {Object[]}
   */
  async broadcastTransaction (transactions, broadcast) {
    if (Array.isArray(transactions) && !transactions.length) {
      return []
    } else if (typeof transactions === 'object' && !transactions.network) {
      return []
    }

    let currentPeer = store.getters['peer/current']()
    if (!currentPeer) {
      currentPeer = this.__parseCurrentPeer()
    }

    let failedBroadcast = false
    if (broadcast) {
      const txs = []
      const peers = store.getters['peer/broadcastPeers']()
      if (peers && peers.length) {
        for (let i = 0; i < peers.length; i++) {
          try {
            const client = await store.dispatch('peer/clientServiceFromPeer', peers[i])
            const transaction = await client.client.api('transactions').create({
              transactions: castArray(transactions)
            })
            txs.push(transaction)
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
        .api('transactions')
        .create({
          transactions: castArray(transactions)
        })
      return [transaction]
    }
  }

  // TODO this shouldn't be responsibility of the client
  __watchProfile () {
    store.watch(
      (_, getters) => getters['session/profile'],
      async (profile, oldProfile) => {
        if (!profile) {
          return
        }

        const currentPeer = store.getters['peer/current']()
        if (currentPeer && currentPeer.ip) {
          const scheme = currentPeer.isHttps ? 'https://' : 'http://'
          this.host = `${scheme}${currentPeer.ip}:${currentPeer.port}`
        }

        if (!oldProfile || profile.id !== oldProfile.id) {
          eventBus.emit('client:changed')
        }
      },
      { immediate: true }
    )
  }
}
