<template>
  <div class="WalletTransactionsMultiSignature">
    <div
      v-if="newTransactionsNotice"
      class="bg-theme-feature flex flex-row"
    >
      <div
        class="mb-2 py-4 px-6 rounded-l text-theme-voting-banner-text bg-theme-voting-banner-background w-full text-center"
      >
        {{ newTransactionsNotice }}
      </div>
    </div>

    <TransactionTableMultiSignature
      :current-page="currentPage"
      :rows="fetchedTransactions"
      :total-rows="totalCount"
      :is-loading="isLoading"
      :is-remote="true"
      :has-pagination="totalCount > 0"
      :per-page="transactionTableRowCount"
      @on-per-page-change="onPerPageChange"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
    />
  </div>
</template>

<script>
import at from 'lodash/at'
import mixin from './mixin'
import { TransactionTableMultiSignature } from '@/components/Transaction'
import MultiSignature from '@/services/client-multisig'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletTransactionsMultiSignature',

  components: {
    TransactionTableMultiSignature
  },

  mixins: [mixin],

  watch: {
    // This watcher would invoke the `fetch` after the `Synchronizer`
    wallet_fromRoute (newValue, oldValue) {
      const currentTimestamp = Math.round((new Date()).getTime() / 1000)
      if (newValue.address !== oldValue.address) {
        this.lastStatusRefresh = null
        this.newTransactionsNotice = null
        this.reset()
        this.loadTransactions()
      } else if (this.lastStatusRefresh < currentTimestamp - 1) {
        this.lastStatusRefresh = currentTimestamp
        this.refreshStatus()
      }
    }
  },

  created () {
    this.loadTransactions()
    this.$eventBus.on('wallet:reload', this.loadTransactions)
    this.$eventBus.on('wallet:reload:multi-signature', this.loadTransactions)
  },

  beforeDestroy () {
    this.$eventBus.off('wallet:reload', this.loadTransactions)
    this.$eventBus.off('wallet:reload:multi-signature', this.loadTransactions)
  },

  methods: {
    async getTransactions (publicKey) {
      const peer = this.$store.getters['session/multiSignaturePeer']
      if (!publicKey || !peer) {
        return {
          totalCount: 0,
          transactions: []
        }
      }

      const transactions = await MultiSignature.getTransactions(peer, publicKey)
      console.log('transactions', transactions)

      return transactions
    },

    async fetchTransactions () {
      // If we're already fetching, it's unneccessary to fetch again
      if (this.isFetching) {
        return
      }

      if (!this.wallet_fromRoute) {
        return
      }

      const publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute)
      console.log('fetchTransactions publicKey', publicKey)
      if (!publicKey) {
        return
      }

      this.isFetching = true

      try {
        const response = await this.getTransactions(publicKey)

        if (publicKey === WalletService.getPublicKeyFromWallet(this.wallet_fromRoute)) {
          this.$set(this, 'fetchedTransactions', response.transactions)
          this.totalCount = response.totalCount
        }
      } catch (error) {
        console.log('fetchTransactions error', error)
        // Ignore the 404 error of wallets that are not on the blockchain
        const messages = at(error, 'response.body.message')
        if (messages[0] !== 'Wallet not found') {
          this.$logger.error(error)

          this.$error(this.$t('COMMON.FAILED_FETCH', {
            name: 'transactions',
            msg: error.message
          }))
        }
        this.fetchedTransactions = []
      } finally {
        this.isFetching = false
        this.isLoading = false
      }
    },

    async refreshStatus () {
      if (!this.wallet_fromRoute) {
        return
      }

      const publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute).slice()
      if (!publicKey) {
        return
      }

      try {
        let newTransactions = 0
        const response = await this.getTransactions(publicKey)
        console.log('refreshStatus response', response)
        for (const transaction of response.transactions) {
          if (!this.fetchedTransactions.some(existingTransaction => existingTransaction.id === transaction.id)) {
            newTransactions++
          }
          // let matched = false
          // for (const existingTransaction of this.fetchedTransactions) {
          //   if (existingTransaction.id === transaction.id) {
          //     matched = true
          //     break
          //   }
          // }
          // if (!matched) {
          //   newTransactions++
          // }
        }

        // Avoid throwing an Error if the user changes to a different route
        if (this.wallet_fromRoute && publicKey === WalletService.getPublicKeyFromWallet(this.wallet_fromRoute) && newTransactions > 0) {
          this.newTransactionsNotice = this.$t('WALLET_TRANSACTIONS.NEW_TRANSACTIONS', {
            count: newTransactions,
            plural: newTransactions > 1 ? 's' : ''
          })
        }
      } catch (error) {
        this.$logger.error('Failed to update confirmations: ', error)
      }
    }
  }
}
</script>
