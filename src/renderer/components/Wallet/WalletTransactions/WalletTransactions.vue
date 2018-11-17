<template>
  <TransactionTable
    :current-page="currentPage"
    :rows="fetchedTransactions"
    :total-rows="totalCount"
    :is-loading="isLoading"
    :is-remote="true"
    :has-pagination="true"
    :sort-query="queryParams.sort"
    @on-per-page-change="onPerPageChange"
    @on-page-change="onPageChange"
    @on-sort-change="onSortChange"
  />
</template>

<script>
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
    totalCount: 0,
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
      if (newValue.address !== oldValue.address) {
        this.reset()
        this.loadTransactions()
      } else {
        this.fetchTransactions()
      }
    }
  },

  created () {
    this.loadTransactions()
    this.$eventBus.on('wallet:fetchTransactions', this.loadTransactions)
  },

  methods: {
    async fetchTransactions () {
      // If we're already fetching, it's unneccessary to fetch again
      if (this.isFetching) return

      this.isFetching = true

      try {
        const { limit, page, sort } = this.queryParams
        const { transactions, totalCount } = await this.$client.fetchWalletTransactions(this.wallet_fromRoute.address, {
          page,
          limit,
          orderBy: `${sort.field}:${sort.type}`
        })

        this.$set(this, 'fetchedTransactions', transactions)
        this.totalCount = totalCount
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
        this.fetchedTransactions = []
      } finally {
        this.isFetching = false
        this.isLoading = false
      }
    },

    /**
     * Fetch the transaction and show the loading animation while the response
     * is received
     */
    async loadTransactions () {
      if (!this.wallet_fromRoute) return
      if (this.isFetching) return // If we're already fetching, it's unneccessary to fetch again

      this.isLoading = true
      this.fetchTransactions()
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

    onSortChange ({ columnName, sortType }) {
      this.__updateParams({
        sort: {
          type: sortType,
          field: columnName
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
