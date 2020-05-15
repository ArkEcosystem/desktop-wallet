import { required } from 'vuelidate/lib/validators'
import Bip38 from '@/services/bip38'
import TransactionService from '@/services/transaction'
import { populateFormFromSchema } from './utils'

export default {
  validators: {
    fee: {
      required,
      isValid () {
        if (this.$refs.fee) {
          return !this.$refs.fee.$v.$invalid
        }

        return false
      }
    },

    passphrase: {
      isValid () {
        if (this.isMultiSignature) {
          return true
        } else if (this.currentWallet && (this.currentWallet.isLedger || this.currentWallet.passphrase)) {
          return true
        }

        if (this.$refs.passphrase) {
          return !this.$refs.passphrase.$v.$invalid
        }

        return false
      }
    },

    walletPassword: {
      isValid () {
        if (this.isMultiSignature) {
          return true
        } else if (this.currentWallet && (this.currentWallet.isLedger || !this.currentWallet.passphrase)) {
          return true
        }

        if (!this.form.walletPassword || !this.form.walletPassword.length) {
          return false
        }

        if (this.$refs.password) {
          return !this.$refs.password.$v.$invalid
        }

        return false
      }
    },

    secondPassphrase: {
      isValid () {
        if (!this.currentWallet.secondPublicKey) {
          return true
        }

        if (this.$refs.secondPassphrase) {
          return !this.$refs.secondPassphrase.$v.$invalid
        }
        return false
      }
    }
  },

  props: {
    schema: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data () {
    return {
      showEncryptLoader: false,
      showLedgerLoader: false,
      wallet: null
    }
  },

  computed: {
    isMultiSignature () {
      return this.currentWallet && !!this.currentWallet.multiSignature
    },

    currentWallet: {
      get () {
        return this.senderWallet || this.wallet_fromRoute
      },

      set (wallet) {
        this.wallet = wallet
      }
    },

    senderLabel () {
      return this.currentWallet ? this.wallet_formatAddress(this.currentWallet.address) : null
    },

    walletNetwork () {
      if (!this.currentWallet || !this.currentWallet.id) {
        return this.session_network
      }

      const profile = this.$store.getters['profile/byId'](this.currentWallet.profileId)
      if (!profile || !profile.id) {
        return this.session_network
      }

      return this.$store.getters['network/byId'](profile.networkId) || this.session_network
    },

    senderWallet () {
      return this.wallet
    },

    hasSchema () {
      return this.schema && !!Object.keys(this.schema).length
    }
  },

  mounted () {
    this.populateSchema()

    if (this.schema.fee) {
      this.$refs.fee.setFee(this.schema.fee)
      this.$refs.fee.chosenFee = 'INPUT'
    } else if (this.$refs.fee) {
      this.form.fee = this.$refs.fee.fee
    }
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

        if (!this.form.wif) {
          return
        }
      }

      this.submit()
    },

    async submit () {
      // Ensure that fee has value, even when the user has not interacted
      if (!this.form.fee && this.$refs.fee) {
        this.$set(this.form, 'fee', this.$refs.fee.fee)
      }

      const transactionData = this.getTransactionData()

      let success = true
      let transaction
      if (!this.currentWallet.isLedger) {
        try {
          transaction = await this.buildTransaction(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)
        } catch (error) {
          this.$logger.error('Could not build transaction: ', error)
          if (this.transactionError) {
            this.transactionError(error)
          }
        }
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
          transaction.totalAmount = TransactionService.getTotalAmount(transaction)
          success = true
        } catch (error) {
          this.$error(`${this.$t('TRANSACTION.LEDGER_SIGN_FAILED')}: ${error.message}`)
        }
        this.showLedgerLoader = false
      }

      if (success) {
        this.emitNext(transaction)

        if (this.postSubmit) {
          this.postSubmit()
        }
      }
    },

    populateSchema () {
      if (this.hasSchema) {
        populateFormFromSchema(this, this.schema)
      }
    },

    getFee () {
      return this.currency_unitToSub(this.form.fee)
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    emitNext (transaction) {
      this.$emit('next', { transaction })
    }
  }
}
