<template>
  <ModalWindow
    :title="$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE')"
    @close="emitCancel"
  >
    <form
      class="flex flex-col my-5"
      @submit.prevent="onSubmit"
    >
      <InputText
        v-model="$v.username.$model"
        :label="usernameLabel"
        :helper-text="usernameError"
        :is-invalid="$v.username.$dirty && $v.username.$invalid"
        class="mb-5"
        name="username"
      />

      <PassphraseInput
        ref="passphrase"
        v-model="$v.passphrase.$model"
        :pub-key-hash="currentNetwork.version"
        class="mb-10"
      />

      <button
        :disabled="$v.$anyError"
        class="blue-button w-full"
      >
        {{ $t('COMMON.NEXT') }}
      </button>
    </form>
  </ModalWindow>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { ModalWindow } from '@/components/Modal'
import { InputText } from '@/components/Input'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletRegisterDelegateModal',

  components: {
    ModalWindow,
    InputText,
    PassphraseInput
  },

  validations: {
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
  },

  data: () => ({
    username: '',
    passphrase: ''
  }),

  computed: {
    usernameLabel () {
      return this.$t('WALLET_DELEGATES.USERNAME')
    },

    usernameError () {
      let error = null

      if (this.$v.username.$dirty) {
        if (!this.$v.username.required) {
          error = this.$t('VALIDATION.REQUIRED', [this.usernameLabel])
        } else if (!this.$v.username.isValid) {
          error = this.$t('VALIDATION.NOT_VALID', [this.usernameLabel])
        }
      }

      return error
    },

    currentNetwork () {
      return this.$store.getters['session/currentNetwork']
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    onSubmit () {
      // TODO: Move to confirm transaction modal
      const transaction = this.$client.sendDelegateRegistration({
        username: this.username,
        passphrase: this.passphrase
      })

      console.log(transaction)
    }
  }
}
</script>
