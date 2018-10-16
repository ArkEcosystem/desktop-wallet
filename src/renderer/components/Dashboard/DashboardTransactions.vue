<template>
  <TransactionTable :transactions="lastTransactions" />
</template>

<script>
import { sortBy, uniqBy } from 'lodash'
import { TransactionTable } from '@/components/Transaction'

export default {
  name: 'DashboardTransactions',

  components: {
    TransactionTable
  },

  props: {
    numberOfTransactions: {
      type: Number,
      required: false,
      default: 10
    }
  },

  data: () => ({
    transactions: []
  }),

  computed: {
    lastTransactions () {
      return sortBy(this.transactions, 'timestamp').reverse().slice(0, this.numberOfTransactions)
    },
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    }
  },

  watch: {
    wallets () {
      this.fetchTransactions()
    }
  },

  created () {
    this.fetchTransactions()
  },

  methods: {
    async fetchTransactions () {
      if (!this.wallets.length) return

      try {
        // TODO if wallets.length > 20 do it in batches
        this.wallets.map(async wallet => {
          const transactions = await this.$client.fetchTransactions(wallet.address)

          // Update the transactions when they are received
          this.transactions = uniqBy([
            ...this.transactions,
            ...transactions
          ], 'id')
        })
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
      }
    }
  }
}
</script>
