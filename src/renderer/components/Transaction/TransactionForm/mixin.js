import Bip38 from '@/services/bip38'
import TransactionService from '@/services/transaction'

export default {
  data () {
    return {
      showEncryptLoader: false,
      showLedgerLoader: false
    }
  },

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    },

    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    walletNetwork () {
      return this.session_network
    }
  },

  mounted () {
    this.form.fee = this.$refs.fee.fee
  },

  methods: {
    /**
     * Decrypt the WIF of the wallet if has a password and submit the form
     */
    async onSubmit () {
      if (this.form.walletPassword && this.form.walletPassword.length) {
        this.showEncryptLoader = true

        const dataToDecrypt = {
          bip38key: this.currentWallet.passphrase,
          password: this.form.walletPassword,
          wif: this.walletNetwork.wif
        }

        const bip38 = new Bip38()
        try {
          const { encodedWif } = await bip38.decrypt(dataToDecrypt)
          this.form.passphrase = null
          this.form.wif = encodedWif
        } catch (_error) {
          this.$error(this.$t('ENCRYPTION.FAILED_DECRYPT'))
        } finally {
          bip38.quit()
        }

        this.showEncryptLoader = false
      }

      this.submit()
    },

    async submit () {
      // Ensure that fee has value, even when the user has not interacted
      if (!this.form.fee) {
        this.$set(this.form, 'fee', this.$refs.fee.fee)
      }

      const transactionData = this.getTransactionData()

      let success = true
      let transaction
      if (!this.currentWallet.isLedger) {
        transaction = await this.buildTransaction(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)
      } else {
        success = false
        this.showLedgerLoader = true
        try {
          const transactionObject = await this.buildTransaction(
            transactionData,
            this.$refs.fee && this.$refs.fee.isAdvancedFee,
            true
          )
          transaction = await TransactionService.ledgerSign(this.currentWallet, transactionObject, this)
          success = true
        } catch (error) {
          this.$error(`${this.$t('TRANSACTION.LEDGER_SIGN_FAILED')}: ${error.message}`)
        }
        this.showLedgerLoader = false
      }

      if (success) {
        this.emitNext(transaction)
      }
    },

    getFee () {
      return parseInt(this.currency_unitToSub(this.form.fee))
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)

      if (this.postSubmit) {
        this.postSubmit()
      }
    },

    emitNext (transaction) {
      this.$emit('next', { transaction })
    }
  }
}
