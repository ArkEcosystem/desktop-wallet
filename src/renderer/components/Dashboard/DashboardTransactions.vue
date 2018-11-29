<template>
  <TransactionTable
    :has-short-id="true"
    :rows="lastTransactions"
  />
</template>

<script>
import { uniqBy } from 'lodash'
import mergeTableTransactions from '@/components/utils/merge-table-transactions'
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
    fetchedTransactions: []
  }),

  computed: {
    lastTransactions () {
      return mergeTableTransactions(this.fetchedTransactions, this.storedTransactions)
    },
    storedTransactions () {
      return this.$store.getters['transaction/byProfileId'](this.session_profile.id)
    },
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    }
  },

  watch: {
    // This watcher would invoke the `fetch` after the `Synchronizer`
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
          const { transactions } = await this.$client.fetchWalletTransactions(wallet.address, {
            limit: this.numberOfTransactions
          })

          // Update the transactions of each wallet when they are received
          this.$set(this, 'fetchedTransactions', uniqBy([
            /*
             * NOTE: The order of this 2 lines is VERY important:
             * recent transactions should override older to have the up-to-date number of confirmations
             */
            ...transactions,
            ...this.fetchedTransactions
          ], 'id'))
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
