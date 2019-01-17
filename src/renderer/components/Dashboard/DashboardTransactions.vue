<template>
  <TransactionTable
    :has-short-id="true"
    :rows="lastTransactions"
    :is-dashboard="true"
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
    fetchedTransactions: [],
    previousWalletAddresses: []
  }),

  computed: {
    lastTransactions () {
      return mergeTableTransactions(this.fetchedTransactions, this.storedTransactions)
    },
    storedTransactions () {
      return this.$store.getters['transaction/byProfileId'](this.session_profile.id, true)
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

      if (updatePreviousWallets) {
        this.updatePreviousWallets()
      }

      try {
        const addresses = this.wallets.map(wallet => wallet.address)
        const walletTransactions = await this.$client.fetchTransactionsForWallets(addresses)
        for (const transactions of Object.values(walletTransactions)) {
          this.$set(this, 'fetchedTransactions', uniqBy([
            /*
             * NOTE: The order of this 2 lines is VERY important:
             * recent transactions should override older to have the up-to-date number of confirmations
             */
            ...transactions.slice(0, this.numberOfTransactions),
            ...this.fetchedTransactions
          ], 'id'))
        }
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
      }
    },

    updatePreviousWallets () {
      this.previousWalletAddresses = this.wallets.map(wallet => wallet.address)
    }
  }
}
</script>
