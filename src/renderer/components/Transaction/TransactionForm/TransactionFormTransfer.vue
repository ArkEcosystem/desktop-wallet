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
      <InputText
        v-model="$v.form.amount.$model"
        :is-invalid="$v.form.amount.$dirty && $v.form.amount.$invalid"
        :label="$t('TRANSACTION.AMOUNT')"
        name="amount"
        class="flex-1 mr-3"
      />

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
        type="button"
        @click="onSubmit"
      >
        {{ $t('COMMON.NEXT') }}
      </button>
    </div>
  </form>
</template>

<script>
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES } from '@config'
import { InputAddress, InputText, InputFee } from '@/components/Input'
import { PassphraseInput } from '@/components/Passphrase'

export default {
  name: 'TransactionFormTransfer',

  transactionType: TRANSACTION_TYPES.TRANSFER,

  validations: {
    form: {
      recipientId: {
        required
      },
      amount: {
        required,
        numeric
      },
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
  },

  components: {
    InputAddress,
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
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    emitNext (transaction) {
      this.$emit('next', transaction)
    },

    onFee (fee) {
      this.form.fee = fee
    },

    onSendAll () {
      // TODO balance - fee?
      this.form.amount = this.currentWallet.balance
    },

    async onSubmit () {
      let transactionData = {
        amount: this.form.amount,
        recipientId: this.form.recipientId,
        vendorField: this.form.vendorField,
        passphrase: this.form.passphrase,
        fee: this.form.fee
      }
      if (this.currentWallet.secondPublicKey) {
        transactionData['secondPassphrase'] = this.form.secondPassphrase
      }

      const transaction = await this.$client.buildTransfer(transactionData)
      this.emitNext(transaction)
    }
  }
}
</script>
