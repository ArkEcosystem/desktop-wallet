<template>
  <div>
    <div
      v-if="newTransactionsNotice"
      class="bg-theme-feature flex flex-row"
    >
      <div
        class="mb-2 py-4 px-6 rounded-l text-theme-voting-banner-text bg-theme-voting-banner-background w-full text-center"
      >
        {{ newTransactionsNotice }}
      </div>
    </div>
    <TransactionTable
      :current-page="currentPage"
      :rows="fetchedTransactions"
      :total-rows="totalCount"
      :is-loading="isLoading"
      :is-remote="true"
      :has-pagination="totalCount > 0"
      :sort-query="queryParams.sort"
      @on-per-page-change="onPerPageChange"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
    />
  </div>
</template>

<script>
import { at } from 'lodash'
import mergeTableTransactions from '@/components/utils/merge-table-transactions'
import TransactionTable from '@/components/Transaction/TransactionTable'

export default {
  name: 'WalletTransactions',

  components: {
    TransactionTable
  },

  data: () => ({
    currentPage: 1,
    isFetching: false,
    isLoading: false,
    fetchedTransactions: [],
    expiryEvents: [],
    totalCount: 0,
    newTransactionsNotice: null,
    lastStatusRefresh: null,
    queryParams: {
      page: 1,
      limit: 10,
      sort: {
        field: 'timestamp',
        type: 'desc'
      }
    }
  }),

  watch: {
    // This watcher would invoke the `fetch` after the `Synchronizer`
    wallet_fromRoute (newValue, oldValue) {
      const currentTimestamp = Math.round((new Date()).getTime() / 1000)
      if (newValue.address !== oldValue.address) {
        this.lastStatusRefresh = null
        this.newTransactionsNotice = null
        this.reset()
        this.loadTransactions()

        this.disableNewTransactionEvent(oldValue.address)
        this.enableNewTransactionEvent(newValue.address)
      } else if (this.lastStatusRefresh < currentTimestamp - 1) {
        this.lastStatusRefresh = currentTimestamp
        this.refreshStatus()
      }
    }
  },

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
    this.unwatchExpired()
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

      return this.$store.getters['transaction/byAddress'](address)
    },

    async getTransactions (address) {
      if (!address) {
        return []
      }

      const { limit, page, sort } = this.queryParams

      return this.$client.fetchWalletTransactions(address, {
        page,
        limit,
        orderBy: `${sort.field}:${sort.type}`
      })
    },

    async fetchTransactions () {
      // If we're already fetching, it's unneccessary to fetch again
      if (this.isFetching) {
        return
      }

      let address
      if (this.wallet_fromRoute) {
        address = this.wallet_fromRoute.address.slice()
      }

      this.isFetching = true

      try {
        const response = await this.getTransactions(address)

        this.$store.dispatch('transaction/deleteBulk', {
          transactions: response.transactions,
          profileId: this.session_profile.profileId
        })

        const transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address))

        if (this.wallet_fromRoute && address === this.wallet_fromRoute.address) {
          this.$set(this, 'fetchedTransactions', transactions)
          this.totalCount = response.totalCount
          this.watchExpired()
        }
      } catch (error) {
        // Ignore the 404 error of wallets that are not on the blockchain
        const messages = at(error, 'response.data.message')
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

    unwatchExpired () {
      for (const event of this.expiryEvents) {
        this.$eventBus.off(event.id, event.method)
      }
      this.expiryEvents = []
    },

    watchExpired () {
      this.unwatchExpired()

      const expireTransaction = (transactionId) => {
        this.fetchedTransactions = this.fetchedTransactions.map(transaction => {
          if (transaction.id !== transactionId) {
            return transaction
          }

          transaction.expired = true

          return transaction
        })
      }

      for (const transaction of this.fetchedTransactions) {
        if (transaction.confirmations > 0) {
          continue
        }

        const event = {
          id: `transaction:${transaction.id}:expired`,
          method: () => { expireTransaction(transaction.id) }
        }
        this.expiryEvents.push(event)
        this.$eventBus.on(event.id, event.method)
      }
    },

    /**
     * Fetch the transaction and show the loading animation while the response
     * is received
     */
    async loadTransactions () {
      if (!this.wallet_fromRoute || this.isFetching) {
        return
      }

      this.newTransactionsNotice = null
      this.isLoading = true
      this.fetchTransactions()
    },

    refreshStatusEvent () {
      this.refreshStatus()
    },

    async refreshStatus () {
      let address
      if (this.wallet_fromRoute) {
        address = this.wallet_fromRoute.address.slice()
      }

      if (!address || !this.wallet_fromRoute) {
        return
      }

      try {
        let newTransactions = 0
        const response = await this.getTransactions(address)
        const transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address))
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

        if (address === this.wallet_fromRoute.address && newTransactions > 0) {
          this.newTransactionsNotice = this.$t('WALLET_TRANSACTIONS.NEW_TRANSACTIONS', {
            count: newTransactions,
            plural: newTransactions > 1 ? 's' : ''
          })
        }
      } catch (error) {
        this.$logger.error('Failed to update confirmations: ', error)
      }
    },

    onPageChange ({ currentPage }) {
      this.currentPage = currentPage
      this.__updateParams({ page: currentPage })
      this.loadTransactions()
    },

    onPerPageChange ({ currentPerPage }) {
      this.__updateParams({ limit: currentPerPage, page: 1 })
      this.loadTransactions()
    },

    onSortChange (sortOptions) {
      this.__updateParams({
        sort: {
          type: sortOptions[0].type,
          field: sortOptions[0].field
        },
        page: 1
      })
      this.loadTransactions()
    },

    reset () {
      this.currentPage = 1
      this.queryParams.page = 1
      this.totalCount = 0
      this.fetchedTransactions = []
    },

    __updateParams (newProps) {
      this.queryParams = Object.assign({}, this.queryParams, newProps)
    }
  }
}
</script>
