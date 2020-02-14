<template>
  <div class="WalletTransactions">
    <div
      v-if="newTransactionsNotice"
      class="WalletTransactions__notice bg-theme-feature flex flex-row"
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
      :is-remote="isRemote"
      :has-pagination="hasPagination"
      :sort-query="sortQuery"
      :per-page="transactionTableRowCount"
      :transaction-type="typeof transactionType !== 'undefined' ? transactionType : null"
      @on-per-page-change="onPerPageChange"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
    />
  </div>
</template>

<script>
export default {
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

  computed: {
    isRemote () {
      if (this.$options.isRemote !== undefined) {
        return this.$options.isRemote
      }

      return true
    },

    hasPagination () {
      if (this.$options.hasPagination !== undefined) {
        return this.$options.hasPagination
      }

      return this.totalCount > 0
    },

    sortQuery () {
      return {
        field: this.queryParams.sort.field,
        type: this.queryParams.sort.type
      }
    },

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
    wallet_fromRoute (newWallet, oldWallet) {
      const currentTimestamp = Math.round((new Date()).getTime() / 1000)
      if ((newWallet && !oldWallet) || (!newWallet && oldWallet) || (newWallet && oldWallet && newWallet.address !== oldWallet.address)) {
        this.reset()
        this.loadTransactions()

        if (this.onWalletChange) {
          this.onWalletChange(newWallet, oldWallet)
        }
      } else if (this.lastStatusRefresh < currentTimestamp - 1) {
        this.lastStatusRefresh = currentTimestamp
        this.refreshStatus()
      }
    }
  },

  methods: {
    /**
     * Fetch the transactions and show the loading animation while the response
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

    onPerPageChange () {
      // Placeholders if not used
    },

    onPageChange () {
      // Placeholders if not used
    },

    __updateParams (newProps) {
      if (!newProps || typeof newProps !== 'object' || newProps === null) {
        return
      }

      this.queryParams = Object.assign({}, this.queryParams, newProps)
    }
  }
}
</script>
