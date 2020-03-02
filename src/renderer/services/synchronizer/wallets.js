import { groupBy, keyBy, maxBy, partition, uniqBy } from 'lodash'
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import eventBus from '@/plugins/event-bus'
import truncateMiddle from '@/filters/truncate-middle'
import TransactionService from '@/services/transaction'

class Action {
  /**
   * Check if the data of a wallet is the same than some data
   *
   * a@param {Object} wallet - wallet with the attributes of a `Wallet` model
   * a@param {Object} walletData - the data that is retrieved from the API
   * @return {Boolean} true if the data is equal
   */
  static compareWalletData (wallet, walletData) {
    return Object.keys(walletData).every(property => wallet[property] === walletData[property])
  }

  constructor (synchronizer) {
    this.synchronizer = synchronizer

    this.checked = []
  }

  get $client () {
    return this.synchronizer.$client
  }

  get $dispatch () {
    return this.synchronizer.$store.dispatch
  }

  get $getters () {
    return this.synchronizer.$store.getters
  }

  get $logger () {
    return this.$scope.$logger
  }

  get $scope () {
    return this.synchronizer.scope
  }

  get $success () {
    return this.$scope.$success
  }

  get $info () {
    return this.$scope.$info
  }

  get $t () {
    return this.$scope.$t.bind(this.$scope)
  }

  get profile () {
    return this.$scope.session_profile
  }

  /**
   * Regular wallets
   */
  get profileWallets () {
    return this.profile
      ? this.$getters['wallet/byProfileId'](this.profile.id)
      : []
  }

  /**
   * NOTE: Ledger wallets should not have its own store, but, since the current
   * implementation does it, it is important to have that in mind and never
   * try to save them as normal wallets
   */
  get ledgerWallets () {
    return this.$getters['session/backgroundUpdateLedger']
      ? this.$getters['ledger/wallets']
      : {}
  }

  get wallets () {
    return [
      ...this.profileWallets,
      ...Object.values(this.ledgerWallets)
    ]
  }

  // TODO contacts should be moved to a new Synchronizer action
  get contacts () {
    return this.profile
      ? this.$getters['wallet/contactsByProfileId'](this.profile.id)
      : []
  }

  get allWallets () {
    return [
      ...this.contacts,
      ...this.wallets
    ]
  }

  /**
   * An `Object` with an address as key and an Array of wallets as value.
   *
   * NOTE: regular wallets and contacts should not be duplicated, but, currently,
   * Ledger wallets could be, so, the same address could belong to 1 wallet
   * on the `wallet` store and 1 wallet on the `ledger` store
   */
  get allWalletsByAddress () {
    return groupBy(this.allWallets, 'address') || []
  }

  /**
   * TODO when adding a new wallet do not display the success toast with the last
   * transaction: is not necessary
   * TODO do not display 2 success toast when sending txs from 1 wallet to other
   */
  async run () {
    if (this.allWallets.length) {
      await this.sync()
    }
    this.$dispatch('transaction/clearUnconfirmedVotes')
    const expiredTransactions = await this.$dispatch('transaction/clearExpired')
    for (const transactionId of expiredTransactions) {
      this.emit(`transaction:${transactionId}:expired`)
      this.$info(this.$t('TRANSACTION.ERROR.EXPIRED', { transactionId: truncateMiddle(transactionId) }))
    }

    await this.processUnconfirmedVotes()
  }

  /**
   * Synchronize the wallets and contacts
   *
   * @return {void}
   */
  async sync () {
    const { walletsData, transactionsByAddress } = await this.fetch()
    const walletsToUpdate = await this.process(walletsData, transactionsByAddress)

    if (walletsToUpdate.length) {
      await this.update(walletsToUpdate)
    }
  }

  /**
   * Fetch, in parallel, the wallet data to every wallet and contact and the transactions
   * of regular and Ledger wallets.
   * Contact transactions are not fetched because they are not processed
   * (i.e. display a toast when a new transaction is received).
   *
   * @return {Object}
   */
  async fetch () {
    const allAddresses = uniqBy(this.allWallets, 'address').map(wallet => wallet.address)
    const walletAddresses = uniqBy(this.wallets, 'address').map(wallet => wallet.address)

    // Fetch in parallel TODO if 1 success and the other fails
    const [walletsData, transactionsByAddress] = await Promise.all([
      this.fetchWalletsData(allAddresses),
      this.fetchWalletsTransactions(walletAddresses)
    ])

    // TODO: this should be removed later, when the transactions are stored, to take advantage of the reactivity
    this.emit('transactions:fetched', transactionsByAddress)

    return { walletsData, transactionsByAddress }
  }

  async fetchWalletsData (addresses) {
    return this.$client.fetchWallets(addresses)
  }

  async fetchWalletsTransactions (addresses) {
    return this.$client.fetchTransactionsForWallets(addresses)
  }

  /**
   * Process, in parallel, the wallets and their transactions and, after that,
   * return the wallets that need to be stored with the updated information.
   *
   * @param {Array} walletsData - the fetched data of the wallets
   * @param {Array} transactionsByAddress - the fetched transactions of each wallet
   * @return {Array} wallets that need update (with their updated data)
   */
  async process (walletsData, transactionsByAddress) {
    // Process in parallel TODO if 1 success and the other fails
    const [dataByWallet, walletsTransactionsAt] = await Promise.all([
      this.processWalletsData(walletsData),
      this.processTransactions(transactionsByAddress)
    ])

    // An address would be updated if it has new data or it has received a new transaction
    const addressesToUpdate = [
      ...Object.keys(dataByWallet),
      ...Object.keys(walletsTransactionsAt)
    ]

    return addressesToUpdate.reduce((walletsToUpdate, address) => {
      // 1 address could have 1 wallet on the `wallet` store and 1 wallet on the `ledger` store
      for (const originalWallet of this.allWalletsByAddress[address]) {
        const wallet = {
          ...originalWallet,
          ...dataByWallet[address]
        }

        if (!wallet.publicKey && originalWallet.publicKey) {
          wallet.publicKey = originalWallet.publicKey
        }

        const checkedAt = walletsTransactionsAt[address]
        if (checkedAt) {
          wallet.transactions = { checkedAt }
        }

        walletsToUpdate.push(wallet)
      }

      return walletsToUpdate
    }, [])
  }

  /**
   * For every wallet data, check which wallets should be updated and return
   * that data aggregated by address
   *
   * @param {Array} walletsData - fetched (incomplete) data of each wallet
   * @return {Object} data of the wallets that should be updated aggregated by address
   */
  processWalletsData (walletsData) {
    return walletsData.reduce((dataByAddress, data) => {
      // 1 address could have 1 wallet on the `wallet` store and 1 wallet on the `ledger` store
      for (const wallet of this.allWalletsByAddress[data.address]) {
        const isEqual = Action.compareWalletData(wallet, data)
        if (!isEqual) {
          dataByAddress[data.address] = data
        }
      }

      return dataByAddress
    }, {})
  }

  /**
   * Fetch the transactions of the wallets and process them.
   *
   * @param  {Object} transactionsByAddress - transactions aggregated by wallet address
   * @return {Object} timestamp of new transactions aggregated by address
   */
  async processTransactions (transactionsByAddress) {
    const walletsTransactionsAt = {}

    for (const address of Object.keys(transactionsByAddress)) {
      const transactions = transactionsByAddress[address]

      if (transactions && transactions.length) {
        const wallet = this.wallets.find(wallet => wallet.address === address)
        const latestAt = await this.processWalletTransactions(wallet, transactions)
        if (latestAt) {
          walletsTransactionsAt[address] = latestAt
        }
      }
    }

    return walletsTransactionsAt
  }

  /**
   * Process the transaction of a wallet:
   *  - If any of the transaction is new, display a toast
   *  - Store the votes of vote transactions
   *  - Return the last time that a new transaction was received
   *
   * @params {Object} wallet
   * @params {Array} transactions - non-empty Array of transactions
   * @return {Number|void} timestamp of the new transaction
   */
  async processWalletTransactions (wallet, transactions) {
    try {
      // TODO delete only 1 time
      this.$dispatch('transaction/deleteBulk', {
        transactions,
        profileId: wallet.profileId
      })

      this.$dispatch('transaction/processVotes', transactions)

      const latestTransaction = maxBy(transactions, 'timestamp')
      const latestAt = latestTransaction.timestamp
      const checkedAt = wallet.transactions ? wallet.transactions.checkedAt : 0

      if (latestAt > checkedAt) {
        // Disable notification on first check
        if (checkedAt > 0) {
          this.displayNewTransaction(latestTransaction, wallet)

          const types = [
            TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION,
            TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
          ]

          if (types.includes(latestTransaction.type)) {
            this.$dispatch('delegate/load')
          }
        }

        return latestAt
      }
    } catch (error) {
      this.$logger.error(error)
    }
  }

  /**
   * Fetch all votes for wallets with unconfirmed vote transactions.
   *
   * @return {void}
   */
  async processUnconfirmedVotes () {
    const unconfirmedVotes = this.$getters['session/unconfirmedVotes']
    const addresses = uniqBy(unconfirmedVotes, 'address').map(wallet => wallet.address)

    for (const address of addresses) {
      const votes = await this.$client.fetchWalletVotes(address)
      await this.$dispatch('transaction/processVotes', votes)
    }
  }

  // TODO use the eventBus to display transactions
  displayNewTransaction (transaction, wallet) {
    switch ((transaction.typeGroup || 1)) {
      case TRANSACTION_GROUPS.STANDARD: {
        this.displayNewStandardTransaction(transaction, wallet)
        break
      }
      case TRANSACTION_GROUPS.MAGISTRATE: {
        this.displayNewMagistrateTransaction(transaction, wallet)
        break
      }
    }
  }

  // TODO use the eventBus to display transactions
  displayNewStandardTransaction (transaction, wallet) {
    let message = {}

    switch (transaction.type) {
      case TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_SECOND_SIGNATURE',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_DELEGATE_REGISTRATION',
          options: {
            address: truncateMiddle(wallet.address),
            username: transaction.asset.delegate.username
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.VOTE: {
        const type = transaction.asset.votes[0].substring(0, 1) === '+' ? 'VOTE' : 'UNVOTE'
        const voteUnvote = this.$t(`SYNCHRONIZER.GROUP_1.${type}`)
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_VOTE',
          options: {
            address: truncateMiddle(wallet.address),
            voteUnvote,
            publicKey: truncateMiddle(transaction.asset.votes[0].substring(1))
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_MULTI_SIGNATURE',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.IPFS: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_IPFS',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT: {
        let amount = this.$scope.currency_toBuilder(0)
        let type = 'SENT'
        let recipient = transaction.asset.payments.filter(payment => payment.recipientId === wallet.address)
        if (recipient.length) {
          type = 'RECEIVED'
          for (const entry of recipient) {
            amount.add(entry.amount)
          }
          recipient = truncateMiddle(wallet.address)
        } else {
          amount = TransactionService.getAmount(this.$scope, transaction, wallet)
          recipient = transaction.asset.payments.length + ' recipients'
        }

        message = {
          translation: `SYNCHRONIZER.GROUP_1.NEW_MULTI_PAYMENT_${type}`,
          options: {
            address: truncateMiddle(wallet.address),
            amount: `${this.$getters['session/network'].symbol}${(amount / 1e8)}`,
            sender: truncateMiddle(transaction.sender),
            recipient
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_1.NEW_DELEGATE_RESIGNATION',
          options: {
            address: truncateMiddle(wallet.address),
            username: transaction.asset.delegate.username
          }
        }
        break
      }
      default: {
        const type = transaction.sender === wallet.address ? 'SENT' : 'RECEIVED'
        message = {
          translation: `SYNCHRONIZER.GROUP_1.NEW_TRANSFER_${type}`,
          options: {
            address: truncateMiddle(wallet.address),
            amount: `${this.$getters['session/network'].symbol}${(transaction.amount / 1e8)}`,
            sender: truncateMiddle(transaction.sender),
            recipient: truncateMiddle(transaction.recipient)
          }
        }
        break
      }
    }

    this.$success(this.$t(message.translation, message.options))
  }

  // TODO use the eventBus to display transactions
  displayNewMagistrateTransaction (transaction, wallet) {
    let message = null

    switch (transaction.type) {
      case TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_REGISTRATION',
          options: {
            address: truncateMiddle(wallet.address),
            name: transaction.asset.businessRegistration.name
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_RESIGNATION',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_UPDATE',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_REGISTRATION',
          options: {
            address: truncateMiddle(wallet.address),
            bridgechain: truncateMiddle(transaction.asset.bridgechainRegistration.genesisHash)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_RESIGNATION',
          options: {
            address: truncateMiddle(wallet.address),
            bridgechain: truncateMiddle(transaction.asset.bridgechainResignation.bridgechainId)
          }
        }
        break
      }
      case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE: {
        message = {
          translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_UPDATE',
          options: {
            address: truncateMiddle(wallet.address),
            bridgechain: truncateMiddle(transaction.asset.bridgechainUpdate.bridgechainId)
          }
        }
        break
      }
    }

    if (message) {
      this.$success(this.$t(message.translation, message.options))
    }
  }

  /**
   * @param {Array} walletsToUpdate - regular or Ledger wallets that should be updated
   */
  async update (walletsToUpdate) {
    const [ledgerWallets, wallets] = partition(walletsToUpdate, 'isLedger')

    try {
      if (wallets.length) {
        this.$dispatch('wallet/updateBulk', wallets)
      }
      if (ledgerWallets.length) {
        this.$dispatch('ledger/updateWallets', keyBy(ledgerWallets, 'address'))
      }
    } catch (error) {
      this.$logger.error(error.message)
    }
  }

  emit (event, data) {
    eventBus.emit(event, data)
  }
}

/*
 * This `Synchronizer` action keeps the wallets of the current profile in sync.
 * Instead of checking each wallet every interval, to be more efficient, since
 * some users have dozens of wallets, it loads their data initially and updates
 * them on each new block.
 *
 * @param {Synchronizer} synchronizer
 * @return {Promise}
 */
const action = async synchronizer => {
  const action = new Action(synchronizer)
  await action.run()
}

export {
  Action,
  action
}
export default action
