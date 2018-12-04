import { difference, last, sortBy } from 'lodash'
import config from '@config'
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
      //       await this.refreshWallets(walletsToCheck)
      //     }
      //   }
      // }

      // Check the not checked wallets now
      if (notChecked.length) {
        await this.refreshWallets(notChecked)
        this.checked = this.checked.concat(notChecked)
      }
    }
  }

  async refreshWallets (wallets) {
    await Promise.all(wallets.map(async wallet => {
      await this.refreshWallet(wallet)
    }))
  }

  async refreshWallet (wallet) {
    try {
      const walletData = await this.$client.fetchWallet(wallet.address)

      if (walletData) {
        const refreshedWallet = {
          ...wallet,
          ...walletData
        }
        this.$dispatch('wallet/update', refreshedWallet)

        await this.fetchWalletTransactions(refreshedWallet)
      }
    } catch (error) {
      this.$logger.error(error.message)
      // TODO the error could mean that the wallet isn't on the blockchain yet
      // this.$error(this.$t('COMMON.FAILED_FETCH', {
      //   name: 'wallet data',
      //   msg: error.message
      // }))
    }
  }

  /**
   * Fetches the transactions of the wallet. In case there are new transactions,
   * it displays the latest one
   */
  async fetchWalletTransactions (wallet) {
    try {
      const { transactions } = await this.$client.fetchWalletTransactions(wallet.address)

      if (transactions && transactions.length) {
        this.$dispatch('transaction/deleteBulk', {
          transactions,
          profileId: wallet.profileId
        })
        const latest = this.findLatestTransaction(transactions)
        const latestAt = latest.timestamp
        const checkedAt = wallet.transactions ? wallet.transactions.checkedAt : 0

        if (latestAt > checkedAt) {
          this.$dispatch('wallet/update', {
            ...wallet,
            transactions: { checkedAt: latestAt }
          })

          // Disable notification on first check
          if (checkedAt > 0) {
            this.displayNewTransaction(latest, wallet)
          }
        }
      }
    } catch (error) {
      this.$logger.error(error)
    }
  }

  findLatestTransaction (transactions) {
    return last(sortBy(transactions, 'timestamp'))
  }

  displayNewTransaction (transaction, wallet) {
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
