import { at, isEqual } from 'lodash'
import mixin from './mixin'
import { TransactionTableMultiSignature } from '@/components/Transaction'
import MultiSignature from '@/services/client-multisig'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletTransactionsMultiSignature',

  isRemote: false,
  hasPagination: false,

  components: {
    TransactionTable: TransactionTableMultiSignature
  },

  mixins: [mixin],

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

      const publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute)
      if (!publicKey) {
        return
      }

      try {
        let newTransactions = 0
        const response = await this.getTransactions(publicKey)
        for (const transaction of response.transactions) {
          if (!this.fetchedTransactions.some(existingTransaction => existingTransaction.id === transaction.id)) {
            newTransactions++
          }
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
    },

    onSortChange ({ source, field, type }) {
      if (!source || source !== 'transactionsTab') {
        return
      }

      if (!isEqual({ field, type }, this.queryParams.sort)) {
        this.__updateParams({
          sort: {
            field,
            type
          }
        })
      }
    },

    reset () {
      this.totalCount = 0
      this.fetchedTransactions = []
      this.newTransactionsNotice = null
    }
  }
}
