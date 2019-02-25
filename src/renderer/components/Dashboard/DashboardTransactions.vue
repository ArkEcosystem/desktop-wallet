<template>
  <TransactionTable
    :has-short-id="true"
    :rows="lastTransactions"
    :is-dashboard="true"
    :is-loading="isLoading"
  />
</template>

<script>
import { uniqBy, orderBy, flatten } from 'lodash'
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
      default: 50
    }
  },

  data: () => ({
    fetchedTransactions: [],
    previousWalletAddresses: [],
    isLoading: false
  }),

  computed: {
    lastTransactions () {
      return mergeTableTransactions(this.fetchedTransactions, this.storedTransactions)
    },
    storedTransactions () {
      return this.$store.getters['transaction/byProfileId'](this.session_profile.id, { includeExpired: true })
    },
    wallets () {
      return [
        ...this.$store.getters['wallet/byProfileId'](this.session_profile.id),
        ...this.$store.getters['ledger/wallets']
      ]
    }
  },

  watch: {
    // This watcher would invoke the `fetch` after the `Synchronizer`
    wallets () {
      let hasNewWallet = false
      for (const wallet of this.wallets) {
        if (!this.previousWalletAddresses.includes(wallet.address)) {
          hasNewWallet = true

          break
        }
      }

      if (hasNewWallet) {
        this.updatePreviousWallets()
        this.fetchTransactions(false)
      }
    }
  },

  created () {
    this.fetchTransactions()
  },

  methods: {
    async fetchTransactions (updatePreviousWallets = true) {
      if (!this.wallets.length) {
        return
      }

      if (!this.fetchedTransactions.length) {
        this.isLoading = true
      }

      if (updatePreviousWallets) {
        this.updatePreviousWallets()
      }

      try {
        const addresses = this.wallets.map(wallet => wallet.address)
        const transactions = await this.$client.fetchTransactionsForWallets(addresses)
        const ordered = orderBy(uniqBy(flatten(Object.values(transactions)), 'id'), 'timestamp', 'desc')
        this.fetchedTransactions = ordered.slice(0, this.numberOfTransactions)
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
      } finally {
        this.isLoading = false
      }
    },

    updatePreviousWallets () {
      this.previousWalletAddresses = this.wallets.map(wallet => wallet.address)
    }
  }
}
</script>
