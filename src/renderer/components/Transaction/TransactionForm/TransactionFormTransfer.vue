<template>
  <form
    class="flex flex-col"
    @submit.prevent
  >
    <InputAddress
      ref="recipient"
      v-model="$v.form.recipientId.$model"
      :label="$t('TRANSACTION.RECIPIENT')"
      :pub-key-hash="session_network.version"
      :show-suggestions="true"
      name="recipientId"
      class="mb-5"
    />

    <div class="flex items-baseline mb-5">
      <InputCurrency
        ref="amount"
        v-model="$v.form.amount.$model"
        :alternative-currency="alternativeCurrency"
        :currency="session_network.token"
        :is-invalid="$v.form.amount.$dirty && $v.form.amount.$invalid"
        :label="$t('TRANSACTION.AMOUNT')"
        :minimum-error="amountTooLowError"
        :maximum-amount="maximumAvailableAmount"
        :maximum-error="notEnoughBalanceError"
        :required="true"
        class="flex-1 mr-3"
        @blur="ensureAvailableAmount"
      />

      <InputSwitch
        :text="$t('TRANSACTION.SEND_ALL')"
        :is-active="isSendAllActive"
        :is-disabled="!canSendAll()"
        @change="onSendAll"
      />
    </div>

    <InputText
      ref="vendorField"
      v-model="$v.form.vendorField.$model"
      :helper-text="vendorFieldError"
      :is-invalid="vendorFieldIsInvalid"
      :label="vendorFieldLabel"
      :bip39-warning="true"
      name="vendorField"
      class="mb-5"
    />

    <InputFee
      v-if="session_network.apiVersion === 2"
      ref="fee"
      :currency="session_network.token"
      :transaction-type="$options.transactionType"
      @input="onFee"
    />

    <div
      v-if="currentWallet.isLedger"
      class="mt-10"
    >
      {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
    </div>
    <InputPassword
      v-else-if="currentWallet.passphrase"
      ref="password"
      class="mt-4"
      v-model="$v.form.walletPassword.$model"
      :label="$t('TRANSACTION.PASSWORD')"
      :is-required="true"
    />
    <PassphraseInput
      v-else
      ref="passphrase"
      class="mt-4"
      v-model="$v.form.passphrase.$model"
      :address="currentWallet.address"
      :pub-key-hash="session_network.version"
    />

    <PassphraseInput
      v-if="currentWallet.secondPublicKey"
      ref="secondPassphrase"
      v-model="$v.form.secondPassphrase.$model"
      :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
      :pub-key-hash="session_network.version"
      class="mt-5"
    />

    <div class="self-start">
      <button
        :disabled="$v.form.$invalid"
        class="blue-button mt-10"
        @click="onSubmit"
      >
        {{ $t('COMMON.NEXT') }}
      </button>
    </div>

    <ModalLoader
      :message="$t('ENCRYPTION.DECRYPTING')"
      :visible="showEncryptLoader"
    />
    <ModalLoader
      :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
      :visible="showLedgerLoader"
    />
  </form>
</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES } from '@config'
import { InputAddress, InputCurrency, InputPassword, InputSwitch, InputText, InputFee } from '@/components/Input'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionService from '@/services/transaction'

export default {
  name: 'TransactionFormTransfer',

  transactionType: TRANSACTION_TYPES.TRANSFER,

  components: {
    InputAddress,
    InputCurrency,
    InputPassword,
    InputSwitch,
    InputText,
    InputFee,
    ModalLoader,
    PassphraseInput
  },

  props: {
    schema: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: vm => ({
    form: {
      amount: '',
      fee: 0,
      passphrase: '',
      walletPassword: '',
      recipientId: '',
      vendorField: ''
    },
    isSendAllActive: false,
    showEncryptLoader: false,
    showLedgerLoader: false,
    bip38Worker: null
  }),

  computed: {
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },
    // Customize the message to display the minimum amount as subunit
    amountTooLowError () {
      const { fractionDigits, token } = this.session_network
      const minimumAmount = Math.pow(10, -fractionDigits)
      const amount = this.currency_format(minimumAmount, { currency: token, currencyDisplay: 'code', subunit: true })
      return this.$t('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', { amount })
    },
    notEnoughBalanceError () {
      const balance = this.formatter_networkCurrency(this.currentWallet.balance)
      return this.$t('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', { balance })
    },
    maximumAvailableAmount () {
      return parseFloat(this.currency_subToUnit(this.currentWallet.balance) - this.form.fee)
    },
    currentWallet () {
      return this.wallet_fromRoute
    },
    vendorFieldLabel () {
      return `${this.$t('TRANSACTION.VENDOR_FIELD')} - ${this.$t('VALIDATION.MAX_LENGTH', [64])}`
    },
    vendorFieldError () {
      if (this.vendorFieldIsInvalid) {
        return this.$t('VALIDATION.TOO_LONG', [this.$refs.vendorField.label])
      }

      return null
    },
    vendorFieldIsInvalid () {
      return this.$v.form.vendorField.$dirty && this.$v.form.vendorField.$invalid
    }
  },

  beforeDestroy () {
    this.bip38Worker.send('quit')
  },

  mounted () {
    // Note: we set this here and not in the data property so validation is triggered properly when fields get pre-populated
    if (this.schema) {
      this.$set(this.form, 'amount', this.schema.amount || '')
      this.$set(this.form, 'recipientId', this.schema.address || '')
      this.$set(this.form, 'vendorField', this.schema.vendorField || '')
    }
    if (this.bip38Worker) {
      this.bip38Worker.send('quit')
    }
    this.bip38Worker = this.$bgWorker.bip38()
    this.bip38Worker.on('message', message => {
      if (message.decodedWif === null) {
        this.$error(this.$t('ENCRYPTION.FAILED_DECRYPT'))
        this.showEncryptLoader = false
      } else if (message.decodedWif) {
        this.form.passphrase = null
        this.form.wif = message.decodedWif
        this.showEncryptLoader = false
        this.submit()
      }
    })
  },

  methods: {
    emitNext (transaction) {
      this.$emit('next', transaction)
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
      this.ensureAvailableAmount()
    },

    onSendAll (isActive) {
      this.isSendAllActive = isActive
      this.ensureAvailableAmount()
    },

    canSendAll () {
      return this.maximumAvailableAmount > 0
    },

    ensureAvailableAmount () {
      if (this.isSendAllActive && this.canSendAll()) {
        this.$set(this.form, 'amount', this.maximumAvailableAmount)
      }
    },

    onSubmit () {
      if (this.form.walletPassword && this.form.walletPassword.length) {
        this.showEncryptLoader = true
        this.bip38Worker.send({
          bip38key: this.currentWallet.passphrase,
          password: this.form.walletPassword,
          wif: this.session_network.wif
        })
      } else {
        this.submit()
      }
    },

    async submit () {
      // v1 compatibility
      // TODO: Get static fee from the network, or allow better UI
      if (this.session_network.apiVersion === 1) {
        this.form.fee = 0.1
      }
      // Ensure that fee has value, even when the user has not interacted
      if (!this.form.fee) {
        this.form.fee = this.$refs.fee.fee
      }

      const transactionData = {
        amount: parseInt(this.currency_unitToSub(this.form.amount)),
        recipientId: this.form.recipientId,
        vendorField: this.form.vendorField,
        passphrase: this.form.passphrase,
        fee: parseInt(this.currency_unitToSub(this.form.fee)),
        wif: this.form.wif
      }
      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      let success = true
      let transaction
      if (!this.currentWallet.isLedger) {
        transaction = await this.$client.buildTransfer(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)
      } else {
        success = false
        this.showLedgerLoader = true
        try {
          const transactionObject = await this.$client.buildTransfer(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee, true)
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
    }
  },

  validations: {
    form: {
      recipientId: {
        required,
        isValid (value) {
          if (this.$refs.recipient) {
            return !this.$refs.recipient.$v.$invalid
          }
          return false
        }
      },
      amount: {
        required,
        isValid (value) {
          if (this.$refs.amount) {
            return !this.$refs.amount.$v.$invalid
          }
          return false
        }
      },
      fee: {
        required,
        isValid () {
          if (this.$refs.fee) {
            return !this.$refs.fee.$v.$invalid
          }
          return this.session_network.apiVersion === 1 // Return true if it's v1, since it has a static fee
        }
      },
      vendorField: {
        maxLength: maxLength(64)
      },
      passphrase: {
        isValid (value) {
          if (this.currentWallet.isLedger || this.currentWallet.passphrase) {
            return true
          }

          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }

          return false
        }
      },
      walletPassword: {
        isValid (value) {
          if (this.currentWallet.isLedger || !this.currentWallet.passphrase) {
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
        isValid (value) {
          if (!this.currentWallet.secondPublicKey) {
            return true
          }

          if (this.$refs.secondPassphrase) {
            return !this.$refs.secondPassphrase.$v.$invalid
          }
          return false
        }
      }
    }
  }
}
</script>
