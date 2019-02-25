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

  created () {
    this.isLoading = true

    this.$eventBus.on('transactions:fetched', transactionsByWallet => {
      const transactions = Object.values(transactionsByWallet)
      const ordered = orderBy(uniqBy(flatten(transactions), 'id'), 'timestamp', 'desc')
      this.fetchedTransactions = ordered.slice(0, this.numberOfTransactions)
      this.isLoading = false
    })
  }
}
</script>
