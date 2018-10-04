<template>
  <form
    class="flex flex-col"
    @submit.prevent="onSubmit"
  >
    <InputText
      v-model="$v.form.username.$model"
      :label="$t('WALLET_DELEGATES.USERNAME')"
      :is-invalid="$v.form.username.$dirty && $v.form.username.$invalid"
      class="mb-5"
      name="username"
    />

    <PassphraseInput
      ref="passphrase"
      v-model="$v.form.passphrase.$model"
      :pub-key-hash="session_network.version"
      class="mb-10"
    />

    <button
      :disabled="$v.form.$invalid"
      class="blue-button w-full"
    >
      {{ $t('COMMON.NEXT') }}
    </button>
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { required } from 'vuelidate/lib/validators'
import { InputText } from '@/components/Input'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionFormDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  validations: {
    form: {
      username: {
        required,
        isValid (value) {
          const validation = WalletService.validateUsername(value)
          return validation ? validation.passes : false
        }
      },
      passphrase: {
        isValid (value) {
          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }
          return false
        }
      }
    }
  },

  components: {
    InputText,
    PassphraseInput
  },

  data: () => ({
    form: {
      username: '',
      passphrase: ''
    }
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async onSubmit () {
      const transaction = await this.$client.buildDelegateRegistration({
        username: this.form.username,
        passphrase: this.form.passphrase
      })

      this.emitNext(transaction)
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  }
}
</script>
