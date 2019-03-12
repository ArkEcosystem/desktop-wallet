import { clone, difference } from 'lodash'
import config from '@config'
import eventBus from '@/plugins/event-bus'
import truncateMiddle from '@/filters/truncate-middle'

class Action {
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

  /**
   * TODO when adding a new wallet do not display the success toast with the last
   * transaction: is not necessary
   * TODO do not display 2 success toast when sending txs from 1 wallet to other
   */
  async run () {
    const profile = this.$scope.session_profile

    if (profile) {
      const allWallets = [
        ...this.$getters['wallet/byProfileId'](profile.id),
        ...this.$getters['wallet/contactsByProfileId'](profile.id)
      ]

      if (this.$getters['session/backgroundUpdateLedger']) {
        allWallets.push(...this.$getters['ledger/wallets'])
      }

      // Retrieve the data of wallets that have not been checked yet
      const notChecked = difference(allWallets, this.checked)

      // Only if all wallets have been checked previously
      // if (this.includesSameWallets(allWallets, notChecked)) {
      //   // To be sure that removed wallets are not used anymore
      //   this.checked = allWallets
      //
      //   if (walletsToCheck.length) {
      //     const since = this.findOldestCheckedAt(walletsToCheck)
      //
      //     const transactions = await this.fetchTransactionsSince(since)
      //     if (transactions) {
      //       transactions.forEach(transaction => {
      //         this.processTransaction(walletsToCheck, transaction)
      //       })
      //
      //     // As a fallback, retrieve all the wallets
      //     } else {
      //       await this.refresh(walletsToCheck)
      //     }
      //   }
      // }

      // Check the not checked wallets now
      if (notChecked.length) {
        await this.refresh(notChecked)
        this.checked = this.checked.concat(notChecked)
      }
    }

    const expiredTransactions = await this.$dispatch('transaction/clearExpired')
    for (const transactionId of expiredTransactions) {
      eventBus.emit(`transaction:${transactionId}:expired`)
      this.$info(this.$t('TRANSACTION.ERROR.EXPIRED', { transactionId: truncateMiddle(transactionId) }))
    }
  }

  /**
   * Refresh the data and transactions of the wallets and process them.
   * @param  {Object[]} wallets
   * @return {void}
   */
  async refresh (wallets) {
    const addresses = wallets.map(wallet => wallet.address)

    // TODO if 1 success and the other fails
    const [walletsData, walletsTransactions] = await Promise.all([
      this.fetchWalletsData(addresses),
      this.fetchWalletsTransactions(addresses)
    ])

    // NOTE: this has to be run in order to avoid race conditions when updating the wallet store TODO change it
    const refreshedWallets = await this.refreshWalletsData(wallets, walletsData)
    const walletsToTouch = await this.refreshTransactions(wallets, walletsTransactions)

    // TODO uniq and update d by id
    const walletsToUpdate = [
      ...refreshedWallets,
      ...walletsToTouch
    ]

    if (walletsToUpdate.length) {
      this.$dispatch('wallet/updateBulk', walletsToUpdate)
    }
  }

  async fetchWalletsData (addresses) {
    return this.$client.fetchWallets(addresses)
  }

  async fetchWalletsTransactions (addresses) {
    return this.$client.fetchTransactionsForWallets(addresses)
  }

  /**
   * Refresh wallet data.
   *
   * @param  {Object[]} wallets
   * @param  {Object[]} walletsData - fetched (incomplete) data of each wallet
   * @return {Object[]} wallets that should be updated
   */
  async refreshWalletsData (wallets, walletsData) {
    const refreshedWallets = []

    for (const wallet of wallets) {
      const walletData = walletsData.find(data => data && data.address === wallet.address)
      if (!walletData || (walletData.balance === 0 && !walletData.publicKey)) {
        continue
      }

      const refreshedWallet = await this.processWalletData(wallet, walletData)
      if (refreshedWallet) {
        refreshedWallets.push(refreshedWallet)
      }
    }

    return refreshedWallets
  }

  /**
   * Fetch the transactions of the wallets and process them.
   *
   * @param  {Object[]} wallets
   * @param  {Object} walletsTransactions - transactions aggregated by wallet address
   * @return {Object[]} wallets that should be updated
   */
  async refreshTransactions (wallets, walletsTransactions) {
    const walletsToTouch = []

    for (const wallet of wallets) {
      const transactions = walletsTransactions[wallet.address]
      if (transactions && transactions.length) {
        const walletToTouch = await this.processWalletTransactions(wallet, transactions)
        if (walletToTouch) {
          walletsToTouch.push(walletToTouch)
        }
      }
    }

    // TODO: this should be removed later, when the transactions are stored, to take advantage of the reactivity
    eventBus.emit(`transactions:fetched`, walletsTransactions)

    return walletsToTouch
  }

  /**
   * Update cached wallet data.
   * TODO dispatch only 1 wallet store update
   *
   * @param  {Object} wallet
   * @param  {Object} walletData Wallet data fetched from API
   * @return {Object|void} wallet to update
   */
  async processWalletData (wallet, walletData) {
    try {
      const refreshedWallet = {
        ...wallet,
        ...walletData
      }
      if (!wallet.isLedger) {
        return refreshedWallet
      }

      this.$dispatch('ledger/updateWallet', { ...wallet, balance: walletData.balance })
    } catch (error) {
      this.$logger.error(error.message)
    }
  }

  /**
   * Processes the transaction of a wallet:
   * TODO dispatch only 1 wallet store update
   *
   *  - Updates the last time that the transactions of a wallet were checked
   *  - If any of the transaction is new, display a toast
   * @return {Object|void} wallet to update
   */
  async processWalletTransactions (wallet, transactions) {
    try {
      if (transactions && transactions.length) {
        this.$dispatch('transaction/deleteBulk', {
          transactions,
          profileId: wallet.profileId
        })

        if (wallet.isLedger) {
          return
        }

        const votes = transactions.filter(tx => tx.type === config.TRANSACTION_TYPES.VOTE)

        if (votes.length) {
          const ids = votes.map(vote => vote.id)
          const filteredVotes = this.$getters['session/unconfirmedVotes'].filter(vote => {
            return !ids.includes(vote.id)
          })

          this.$dispatch('session/setUnconfirmedVotes', filteredVotes)

          const profile = clone(this.$scope.session_profile)
          profile.unconfirmedVotes = filteredVotes
          this.$dispatch('profile/update', profile)
        }

        const latest = this.findLatestTransaction(transactions)
        const latestAt = latest.timestamp
        const checkedAt = wallet.transactions ? wallet.transactions.checkedAt : 0

        if (latestAt > checkedAt) {
          // Disable notification on first check
          if (checkedAt > 0) {
            this.displayNewTransaction(latest, wallet)
          }

          return {
            ...wallet,
            transactions: { checkedAt: latestAt }
          }
        }
      }
    } catch (error) {
      this.$logger.error(error)
    }
  }

  findLatestTransaction (transactions) {
    var latestTransaction = transactions[0]

    for (const i in transactions) {
      if (transactions[i].timestamp > latestTransaction.timestamp) {
        latestTransaction = transactions[i]
      }
    }

    return latestTransaction
  }

  displayNewTransaction (transaction, wallet) {
    if (wallet.isContact) {
      return
    }

    let message = {}
    switch (transaction.type) {
      case config.TRANSACTION_TYPES.SECOND_SIGNATURE: {
        message = {
          translation: 'SYNCHRONIZER.NEW_SECOND_SIGNATURE',
          options: {
            address: truncateMiddle(wallet.address)
          }
        }
        break
      }
      case config.TRANSACTION_TYPES.DELEGATE_REGISTRATION: {
        message = {
          translation: 'SYNCHRONIZER.NEW_DELEGATE_REGISTRATION',
          options: {
            address: truncateMiddle(wallet.address),
            username: transaction.assets.delegate.username
          }
        }
        break
      }
      case config.TRANSACTION_TYPES.VOTE: {
        const type = transaction.asset.votes[0].substring(0, 1) === '+' ? 'VOTE' : 'UNVOTE'
        const voteUnvote = this.$t(`SYNCHRONIZER.${type}`)
        message = {
          translation: 'SYNCHRONIZER.NEW_VOTE',
          options: {
            address: truncateMiddle(wallet.address),
            voteUnvote,
            publicKey: truncateMiddle(transaction.asset.votes[0].substring(1))
          }
        }
        break
      }
      default: {
        const type = transaction.sender === wallet.address ? 'SENT' : 'RECEIVED'
        message = {
          translation: `SYNCHRONIZER.NEW_TRANSFER_${type}`,
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
