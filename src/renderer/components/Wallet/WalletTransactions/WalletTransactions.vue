<template>
  <TransactionTable
    :transactions="transactions"
  />
</template>

<script>
import { TransactionTable } from '@/components/Transaction'

export default {
  name: 'WalletTransactions',

  components: {
    TransactionTable
  },

  data: () => ({
    transactions: []
  }),

  watch: {
    wallet_fromRoute () {
      this.fetchTransactions()
    }
  },

  created () {
    this.fetchTransactions()
  },

  methods: {
    async fetchTransactions () {
      if (!this.wallet_fromRoute) return

      try {
        this.transactions = await this.$client.fetchTransactions(this.wallet_fromRoute.address)
      } catch (error) {
        console.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
        this.transactions = []
      }
    }
  }
}
</script>
