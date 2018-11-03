<template>
  <TransactionTable
    :current-page="currentPage"
    :rows="transactions"
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
import { orderBy } from 'lodash'

export default {
  name: 'WalletTransactions',

  components: {
    TransactionTable
  },

  data: () => ({
    currentPage: 1,
    isLoading: false,
    transactions: [],
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
    'wallet_fromRoute.id' () {
      this.reset()
      this.fetchTransactions()
    }
  },

  created () {
    this.fetchTransactions()
    this.$eventBus.on('wallet:fetchTransactions', this.fetchTransactions)
  },

  methods: {
    async fetchTransactions () {
      if (!this.wallet_fromRoute) return
      if (this.isLoading) return // If we're already fetching, it's unneccessary to fetch again

      try {
        this.isLoading = true
        const { transactions, totalCount } = await this.$client.fetchTransactions(this.wallet_fromRoute.address, {
          page: this.queryParams.page,
          limit: this.queryParams.limit,
          orderBy: `${this.queryParams.sort.field}:${this.queryParams.sort.type}`
        })
        this.transactions = this.__sortTransactions(transactions)
        this.totalCount = totalCount
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
        this.transactions = []
      } finally {
        this.isLoading = false
      }
    },

    onPageChange ({ currentPage }) {
      this.currentPage = currentPage
      this.__updateParams({ page: currentPage })
      this.fetchTransactions()
    },

    onPerPageChange ({ currentPerPage }) {
      this.__updateParams({ limit: currentPerPage, page: 1 })
      this.fetchTransactions()
    },

    onSortChange ({ columnName, sortType }) {
      this.__updateParams({
        sort: {
          type: sortType,
          field: columnName
        },
        page: 1
      })
      this.fetchTransactions()
    },

    reset () {
      this.currentPage = 1
      this.queryParams.page = 1
      this.totalCount = 0
      this.transactions = []
    },

    // TODO: Sort remotely
    __sortTransactions (transactions = this.transactions) {
      return orderBy(transactions, [this.queryParams.sort.field], [this.queryParams.sort.type])
    },

    __updateParams (newProps) {
      this.queryParams = Object.assign({}, this.queryParams, newProps)
    }
  }
}
</script>
