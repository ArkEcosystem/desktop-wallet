import { at, isEqual } from 'lodash'
import mixin from './mixin'
import mergeTableTransactions from '@/components/utils/merge-table-transactions'
import { TransactionTable } from '@/components/Transaction'

export default {
  name: 'WalletTransactions',

  components: {
    TransactionTable
  },

  mixins: [mixin],

  created () {
    this.loadTransactions()
    this.$eventBus.on('wallet:reload', this.loadTransactions)
    this.enableNewTransactionEvent(this.wallet_fromRoute.address)
  },

  beforeDestroy () {
    this.$eventBus.off('wallet:reload', this.loadTransactions)
    if (this.wallet_fromRoute) {
      this.disableNewTransactionEvent(this.wallet_fromRoute.address)
    }
  },

  methods: {
    enableNewTransactionEvent (address) {
      if (!address) {
        return
      }

      this.disableNewTransactionEvent(address)
      this.$eventBus.on(`wallet:${address}:transaction:new`, this.refreshStatusEvent)
    },

    disableNewTransactionEvent (address) {
      if (!address) {
        return
      }

      try {
        this.$eventBus.off(`wallet:${address}:transaction:new`, this.refreshStatusEvent)
      } catch (error) {
        //
      }
    },

    getStoredTransactions (address) {
      if (!address) {
        return []
      }

      const transactions = this.$store.getters['transaction/byAddress'](address, { includeExpired: true })

      if (this.transactionType === null) {
        return transactions
      }

      return transactions.filter(transaction => transaction.type === this.transactionType)
    },

    async getTransactions (address) {
      if (!address) {
        return []
      }

      const { limit, page, sort } = this.queryParams

      const response = await this.$client.fetchWalletTransactions(address, {
        transactionType: this.transactionType,
        page,
        limit,
        orderBy: `${sort.field}:${sort.type}`
      })

      return response
    },

    async fetchTransactions () {
      // If we're already fetching, it's unneccessary to fetch again
      if (this.isFetching) {
        return
      }

      let address
      if (this.wallet_fromRoute) {
        address = this.wallet_fromRoute.address
      }

      this.isFetching = true

      try {
        const response = await this.getTransactions(address)

        this.$store.dispatch('transaction/deleteBulk', {
          transactions: response.transactions,
          profileId: this.session_profile.id
        })

        const transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address), this.queryParams.sort)

        if (this.wallet_fromRoute && address === this.wallet_fromRoute.address) {
          this.$set(this, 'fetchedTransactions', transactions)
          // TODO: Does this need fixing? This only stores total count from API, not including locally stored transactions
          this.totalCount = response.totalCount
        }
      } catch (error) {
        // Ignore the 404 error of wallets that are not on the blockchain
        const messages = at(error, 'response.body.message')
        if (messages[0] !== 'Wallet not found') {
          this.$logger.error(error)

          this.$error(this.$t('COMMON.FAILED_FETCH', {
            name: 'transactions',
            msg: error.message
          }))
        }
        this.fetchedTransactions = []
      } finally {
        this.isFetching = false
        this.isLoading = false
      }
    },

    refreshStatusEvent () {
      this.refreshStatus()
    },

    async refreshStatus () {
      if (!this.wallet_fromRoute || !this.wallet_fromRoute.address) {
        return
      }

      const address = this.wallet_fromRoute.address

      try {
        let newTransactions = 0
        const response = await this.getTransactions(address)
        const transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address), this.queryParams.sort)
        for (const existingTransaction of this.fetchedTransactions) {
          for (const transaction of transactions) {
            if (existingTransaction.id === transaction.id) {
              existingTransaction.confirmations = transaction.confirmations
              break
            }
          }
        }

        for (const transaction of transactions) {
          let matched = false
          for (const existingTransaction of this.fetchedTransactions) {
            if (existingTransaction.id === transaction.id) {
              matched = true
              break
            }
          }
          if (!matched) {
            newTransactions++
          }
        }

        // Avoid throwing an Error if the user changes to a different route
        if (this.wallet_fromRoute) {
          if (address === this.wallet_fromRoute.address && newTransactions > 0) {
            this.newTransactionsNotice = this.$tc('WALLET_TRANSACTIONS.NEW_TRANSACTIONS', newTransactions, {
              count: newTransactions
            })
          }
        }
      } catch (error) {
        this.$logger.error('Failed to update confirmations: ', error)
      }
    },

    onWalletChange (newWallet, oldWallet) {
      if (oldWallet) {
        this.disableNewTransactionEvent(oldWallet.address)
      }
      if (newWallet) {
        this.enableNewTransactionEvent(newWallet.address)
      }
    },

    onPageChange ({ currentPage }) {
      if (currentPage && currentPage !== this.currentPage) {
        this.currentPage = currentPage
        this.__updateParams({ page: currentPage })
        this.loadTransactions()
      }
    },

    onPerPageChange ({ currentPerPage }) {
      if (currentPerPage && currentPerPage !== this.transactionTableRowCount) {
        this.transactionTableRowCount = currentPerPage
        this.currentPage = 1
        this.__updateParams({ limit: currentPerPage, page: 1 })
        this.loadTransactions()
      }
    },

    onSortChange ({ source, field, type }) {
      if (!source || source !== 'transactionsTab') {
        return
      }

      if (!isEqual({ field, type }, this.queryParams.sort)) {
        this.__updateParams({
          sort: {
            field,
            type
          },
          page: 1
        })
        this.loadTransactions()
      }
    },

    reset () {
      this.currentPage = 1
      this.queryParams.page = 1
      this.totalCount = 0
      this.fetchedTransactions = []
      this.lastStatusRefresh = null
      this.newTransactionsNotice = null
    }
  }
}
