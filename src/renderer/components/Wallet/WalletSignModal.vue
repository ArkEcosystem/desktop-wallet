<template>
  <ModalWindow
    :title="$t('SIGN_VERIFY.TITLE_SIGN')"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center w-80">
      <WalletSelection
        v-if="schema && schema.message"
        v-model="$v.wallet.$model"
        profile-class="mb-5"
      />

      <InputText
        v-else
        :is-read-only="true"
        :label="$t('SIGN_VERIFY.ADDRESS')"
        :value="wallet.address"
        class="mt-5"
        name="address"
      />

      <PassphraseInput
        v-if="!wallet || !wallet.passphrase"
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :is-invalid="$v.form.passphrase.$error"
        :address="wallet ? wallet.address : null"
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
import WalletSelection from '@/components/Wallet/WalletSelection'
import Bip38 from '@/services/bip38'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletSignModal',

  components: {
    InputPassword,
    InputText,
    ModalLoader,
    ModalWindow,
    PassphraseInput,
    WalletSelection
  },

  props: {
    schema: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    form: {
      message: '',
      passphrase: '',
      walletPassword: ''
    },
    showEncryptLoader: false,
    wallet: null
  }),

  computed: {
    messageError () {
      if (this.$v.form.message.$error && this.$v.form.message.minLength) {
        return this.$t('VALIDATION.REQUIRED', [this.$refs['message'].label])
      }
      return null
    },
    currentWallet: {
      get () {
        return this.wallet || this.wallet_fromRoute
      },
      set (wallet) {
        this.wallet = wallet
      }
    }
  },

  mounted () {
    console.log('mounted')
    console.log(this.schema)

    if (this.currentWallet && this.currentWallet.id) {
      this.$set(this, 'wallet', this.currentWallet || null)
      this.$v.wallet.$touch()
    }

    if (this.schema) {
      this.$set(this.form, 'message', this.schema.message || '')
    }
  },

  methods: {
    async onSignMessage () {
      if (!this.form.walletPassword || !this.form.walletPassword.length) {
        this.signMessage()
      } else {
        this.showEncryptLoader = true

        const dataToDecrypt = {
          bip38key: this.wallet.passphrase,
          password: this.form.walletPassword,
          wif: this.session_network.wif
        }

        const bip38 = new Bip38()
        try {
          const { encodedWif } = await bip38.decrypt(dataToDecrypt)
          this.form.passphrase = null
          this.form.wif = encodedWif
          this.signMessage()
        } catch (_error) {
          this.$error(this.$t('ENCRYPTION.FAILED_DECRYPT'))
        }

        this.showEncryptLoader = false
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
    wallet: {},
    form: {
      message: {
        required,
        minLength: minLength(1)
      },
      passphrase: {
        isValid (value) {
          if (!this.wallet) return true
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
          if (!this.wallet) return true
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
