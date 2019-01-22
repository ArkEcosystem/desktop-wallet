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
        v-if="!wallet.passphrase"
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :is-invalid="$v.form.passphrase.$error"
        :address="wallet.address"
        :pub-key-hash="session_network.version"
        class="my-3"
      />
      <InputPassword
        v-else
        ref="password"
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
        class="my-3"
      />

      <InputText
        ref="message"
        v-model="$v.form.message.$model"
        :label="$t('SIGN_VERIFY.MESSAGE')"
        :helper-text="messageError"
        :is-invalid="$v.form.message.$error"
        name="message"
      />

      <button
        :disabled="$v.form.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="onSignMessage"
      >
        {{ $t('SIGN_VERIFY.SIGN') }}
      </button>
    </div>

    <ModalLoader
      :message="$t('ENCRYPTION.DECRYPTING')"
      :visible="showEncryptLoader"
    />
  </ModalWindow>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { InputPassword, InputText } from '@/components/Input'
import { ModalLoader, ModalWindow } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletSignModal',

  components: {
    InputPassword,
    InputText,
    ModalLoader,
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
      passphrase: '',
      walletPassword: ''
    },
    showEncryptLoader: false,
    bip38Worker: null
  }),

  computed: {
    messageError () {
      if (this.$v.form.message.$error) {
        if (this.$v.form.message.minLength) {
          return this.$t('VALIDATION.REQUIRED', [this.$refs['message'].label])
        }
      }
      return null
    }
  },

  mounted () {
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
        this.signMessage()
      }
    })
  },

  methods: {
    onSignMessage () {
      if (this.form.walletPassword && this.form.walletPassword.length) {
        this.showEncryptLoader = true
        this.bip38Worker.send({
          bip38key: this.wallet.passphrase,
          password: this.form.walletPassword,
          wif: this.session_network.wif
        })
      } else {
        this.signMessage()
      }
    },

    signMessage () {
      try {
        let message
        if (this.form.wif) {
          message = WalletService.signMessageWithWif(this.form.message, this.form.wif)
        } else {
          message = WalletService.signMessage(this.form.message, this.form.passphrase)
        }
        message['timestamp'] = new Date().getTime()
        message['address'] = this.wallet.address
        this.$store.dispatch('wallet/addSignedMessage', message)

        this.$success(this.$t('SIGN_VERIFY.SUCCESSFULL_SIGN'))

        this.emitSigned()
      } catch (error) {
        this.$error(this.$t('SIGN_VERIFY.FAILED_SIGN'))
      }
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
      },
      walletPassword: {
        isValid (value) {
          if (!this.wallet.passphrase) {
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
      }
    }
  }
}
</script>
