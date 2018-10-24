<template>
  <ModalWindow
    :title="$t('SIGN_VERIFY.TITLE_SIGN')"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center w-80">
      <InputText
        :is-read-only="true"
        :label="$t('SIGN_VERIFY.ADDRESS')"
        :value="wallet.address"
        class="mt-5"
        name="address"
      />

      <PassphraseInput
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="wallet.address"
        :pub-key-hash="session_network.version"
        class="my-3"
      />

      <InputText
        v-model="$v.form.message.$model"
        :label="$t('SIGN_VERIFY.MESSAGE')"
        name="message"
      />

      <button
        :disabled="$v.form.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="signMessage"
      >
        {{ $t('SIGN_VERIFY.SIGN') }}
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { InputText } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletSignModal',

  components: {
    InputText,
    ModalWindow,
    PassphraseInput
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      message: '',
      passphrase: ''
    }
  }),

  mounted () {
  },

  methods: {
    signMessage () {
      // TODO: Use try catch for the sign function?
      var message = WalletService.signMessage(this.form.message, this.form.passphrase)
      message['timestamp'] = new Date().getTime()
      message['address'] = this.wallet.address
      this.$store.dispatch('wallet/addSignedMessage', message)

      this.emitSigned()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitSigned () {
      this.$emit('signed')
    }
  },

  validations: {
    form: {
      message: {
        required,
        minLength: minLength(1)
      },
      passphrase: {
        isValid (value) {
          if (this.wallet.passphrase) {
            return true
          }

          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }

          return false
        }
      }
    }
  }
}
</script>
