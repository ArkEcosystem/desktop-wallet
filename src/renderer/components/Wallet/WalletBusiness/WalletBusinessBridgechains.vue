<template>
  <div class="WalletBusinessBridgechains">
    <WalletBusinessBridgechainsTable
      :current-page="currentPage"
      :rows="fetchedTransactions"
      :total-rows="totalCount"
      :is-loading="isLoading"
      :is-remote="true"
      :has-pagination="totalCount > 0"
      :sort-query="{
        field: queryParams.sort.field,
        type: queryParams.sort.type
      }"
      :aaaaaaaaper-page="transactionTableRowCount"
      :transaction-type="transactionType"
      @on-per-page-change="onPerPageChange"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import WalletBusinessBridgechainsTable from './WalletBusinessBridgechainsTable'

export default {
  name: 'WalletBusinessBridgechains',

  components: {
    WalletBusinessBridgechainsTable
  },

  props: {
    transactionType: {
      type: Number,
      required: false,
      default: null
    }
  },

  data: () => ({
    currentPage: 1,
    isFetching: false,
    isLoading: false,
    fetchedTransactions: [],
    expiryEvents: [],
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

  computed: {
    transactionTableRowCount: {
      get () {
        return this.$store.getters['session/transactionTableRowCount']
      },
      set (count) {
        this.$store.dispatch('session/setTransactionTableRowCount', count)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          transactionTableRowCount: count
        })
      }
    }
  },

  watch: {
    // This watcher would invoke the `fetch` after the `Synchronizer`
    wallet_fromRoute (newValue, oldValue) {
      if (newValue.address !== oldValue.address) {
        this.reset()
        this.loadTransactions()
      }
    }
  },

  created () {
    this.loadTransactions()
    this.$eventBus.on('wallet:reload', this.loadTransactions)
  },

  beforeDestroy () {
    this.$eventBus.off('wallet:reload', this.loadTransactions)
  },

  methods: {
    async fetchTransactions () {
      // If we're already fetching, it's unneccessary to fetch again
      if (this.isFetching) {
        return
      }

      let address, businessId
      if (this.wallet_fromRoute) {
        console.log('fetchTransactions', this.wallet_fromRoute)
        address = this.wallet_fromRoute.address.slice()
        businessId = this.wallet_fromRoute.business.businessId
      }

      this.isFetching = true

      try {
        const { limit, page, sort } = this.queryParams
        const response = await this.$client.fetchBusinessBridgechains(businessId, {
          transactionType: this.transactionType,
          page,
          limit,
          orderBy: `${sort.field}:${sort.type}`
        })

        if (this.wallet_fromRoute && address === this.wallet_fromRoute.address) {
          this.$set(this, 'fetchedTransactions', response.data)
          this.totalCount = response.meta.totalCount
        }
      } catch (error) {
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
      if (!this.wallet_fromRoute || this.isFetching) {
        return
      }

      this.isLoading = true
      this.fetchTransactions()
    },

    onPageChange ({ currentPage }) {
      this.currentPage = currentPage
      this.__updateParams({ page: currentPage })
      this.loadTransactions()
    },

    onPerPageChange ({ currentPerPage }) {
      // this.transactionTableRowCount = currentPerPage
      this.__updateParams({ limit: currentPerPage, page: 1 })
      this.loadTransactions()
    },

    onSortChange ({ source, field, type }) {
      if (!source) {
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
    },

    __updateParams (newProps) {
      this.queryParams = Object.assign({}, this.queryParams, newProps)
    }
  }
}
</script>
