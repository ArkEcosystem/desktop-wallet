<template>
  <TransactionTable
    :has-short-id="true"
    :rows="lastTransactions"
    :is-dashboard="true"
    :is-loading="isLoading"
    :no-data-message="$t('TABLE.NO_TRANSACTIONS')"
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
      return mergeTableTransactions(
        this.fetchedTransactions,
        this.storedTransactions
      )
    },
    storedTransactions () {
      return this.$store.getters['transaction/byProfileId'](
        this.session_profile.id,
        { includeExpired: true }
      )
    },
    wallets () {
      return [
        ...this.$store.getters['wallet/byProfileId'](this.session_profile.id),
        ...this.$store.getters['ledger/wallets']
      ]
    }
  },

  created () {
    if (this.wallets.length) {
      this.isLoading = true
    }

    this.$eventBus.on('transactions:fetched', transactionsByWallet => {
      const transactions = flatten(Object.values(transactionsByWallet))
      this.fetchedTransactions = this.processTransactions(transactions)
      this.isLoading = false
    })
  },

  methods: {
    processTransactions (transactions) {
      const ordered = orderBy(uniqBy(transactions, 'id'), 'timestamp', 'desc')
      return ordered.slice(0, this.numberOfTransactions)
    }
  }
}
</script>
