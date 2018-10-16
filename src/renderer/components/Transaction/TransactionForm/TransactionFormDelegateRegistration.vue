<template>
  <form
    class="TransactionFormDelegateRegistration flex flex-col"
    @submit.prevent="onSubmit"
  >
    <div>
      {{ $t('TRANSACTION.FORM.DELEGATE_REGISTRATION.INSTRUCTIONS', { address: currentWallet.address }) }}
    </div>

    <InputText
      v-model="$v.form.username.$model"
      :helper-text="error"
      :label="$t('WALLET_DELEGATES.USERNAME')"
      :is-invalid="$v.form.username.$dirty && $v.form.username.$invalid"
      class="mb-5"
      name="username"
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

    <button
      :disabled="$v.form.$invalid"
      class="blue-button mt-10 ml-0"
      @click="onSubmit"
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
          if (validation && validation.passes) {
            this.error = null
            return validation.passes
          }

          this.error = this.$t('WALLET_DELEGATES.USERNAME_ERROR')
          return false
        }
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
    InputText,
    PassphraseInput
  },

  data: () => ({
    form: {
      username: '',
      passphrase: ''
    },
    error: null
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async onSubmit () {
      let transactionData = {
        username: this.form.username,
        passphrase: this.form.passphrase
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData['secondPassphrase'] = this.form.secondPassphrase
      }

      const transaction = await this.$client.buildDelegateRegistration(transactionData)
      this.emitNext(transaction)
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  }
}
</script>
