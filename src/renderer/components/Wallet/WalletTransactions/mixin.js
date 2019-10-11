export default {
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

    onPageChange ({ currentPage }) {
      this.currentPage = currentPage
      this.__updateParams({ page: currentPage })
      this.loadTransactions()
    },

    onPerPageChange ({ currentPerPage }) {
      this.__updateParams({ limit: currentPerPage, page: 1 })
      this.loadTransactions()
      this.transactionTableRowCount = currentPerPage
    },

    onSortChange (sortOptions) {
      const columnName = sortOptions[0].field
      const sortType = sortOptions[0].type

      this.__updateParams({
        sort: {
          field: columnName,
          type: sortType
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
