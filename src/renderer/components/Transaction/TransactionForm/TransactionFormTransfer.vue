<template>
  <form
    class="flex flex-col"
    @submit.prevent="onSubmit"
  >
    <InputAddress
      v-model="$v.form.recipientId.$model"
      :label="$t('TRANSACTION.RECIPIENT')"
      :pub-key-hash="session_network.version"
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
        :maximum-amount="parseFloat(currency_subToUnit(senderWallet.balance))"
        :maximum-error="notEnoughBalanceError"
        :required="true"
        class="flex-1 mr-3"
      />

      <!-- TODO This button could be activated to change the amount dynamically when the fee changes -->
      <button
        type="button"
        class="action-button"
        @click="onSendAll"
      >
        {{ $t('TRANSACTION.SEND_ALL') }}
      </button>
    </div>

    <InputText
      v-model="$v.form.vendorField.$model"
      :is-invalid="$v.form.vendorField.$dirty && $v.form.vendorField.$invalid"
      :label="$t('TRANSACTION.VENDOR_FIELD')"
      name="vendorField"
      class="mb-5"
    />

    <InputFee
      v-if="session_network.apiVersion === 2"
      v-model="$v.form.fee.$model"
      :transaction-type="$options.transactionType"
      @input="onFee"
    />

    <PassphraseInput
      ref="passphrase"
      v-model="$v.form.passphrase.$model"
      :address="senderWallet.address"
      :pub-key-hash="session_network.version"
    />

    <PassphraseInput
      v-if="senderWallet.secondPublicKey"
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
        type="submit"
      >
        {{ $t('COMMON.NEXT') }}
      </button>
    </div>
  </form>
</template>

<script>
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES } from '@config'
import { InputAddress, InputCurrency, InputText, InputFee } from '@/components/Input'
import { PassphraseInput } from '@/components/Passphrase'

export default {
  name: 'TransactionFormTransfer',

  transactionType: TRANSACTION_TYPES.TRANSFER,

  components: {
    InputAddress,
    InputCurrency,
    InputText,
    InputFee,
    PassphraseInput
  },

  data: () => ({
    form: {
      recipientId: '',
      amount: '',
      vendorField: '',
      passphrase: '',
      fee: 0
    }
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
      const balance = this.formatter_networkCurrency(this.senderWallet.balance)
      return this.$t('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', { balance })
    },
    senderWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    emitNext (transaction) {
      this.$emit('next', transaction)
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    onSendAll () {
      this.$set(this.form, 'amount', this.currency_subToUnit(this.senderWallet.balance - this.form.fee))
    },

    async onSubmit () {
      let transactionData = {
        amount: this.currency_unitToSub(this.form.amount),
        recipientId: this.form.recipientId,
        vendorField: this.form.vendorField,
        passphrase: this.form.passphrase,
        fee: this.form.fee
      }
      if (this.senderWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      const transaction = await this.$client.buildTransfer(transactionData)
      this.emitNext(transaction)
    }
  },

  validations: {
    form: {
      recipientId: {
        required
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
      // TODO check that amount + fee <= balance
      fee: {
        required,
        numeric
      },
      vendorField: {
        maxLength: maxLength(64)
      },
      passphrase: {
        isValid (value) {
          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }
          return false
        }
      },
      secondPassphrase: {
        isValid (value) {
          if (!this.senderWallet.secondPublicKey) {
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
