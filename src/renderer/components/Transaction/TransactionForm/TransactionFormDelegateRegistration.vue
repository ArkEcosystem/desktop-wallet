<template>
  <form
    class="TransactionFormDelegateRegistration flex flex-col"
    @submit.prevent
  >
    <template v-if="!currentWallet.isDelegate">
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
        v-if="!currentWallet.passphrase"
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="currentWallet.address"
        :pub-key-hash="session_network.version"
      />
      <InputPassword
        v-else
        ref="password"
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
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

      <ModalLoader
        ref="modalLoader"
        :message="$t('ENCRYPTION.DECRYPTING')"
        :visible="showEncryptLoader"
      />

      <portal to="transaction-footer">
        <footer class="ModalWindow__container__footer--warning">
          {{ $t('TRANSACTION.FOOTER_TEXT.DELEGATE_REGISTRATION') }}
        </footer>
      </portal>
    </template>
    <template v-else>
      {{ $t('WALLET_DELEGATES.ALREADY_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES } from '@config'
import { InputPassword, InputText } from '@/components/Input'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionFormDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  components: {
    InputPassword,
    InputText,
    ModalLoader,
    PassphraseInput
  },

  data: () => ({
    form: {
      username: '',
      passphrase: '',
      walletPassword: null
    },
    error: null,
    showEncryptLoader: false,
    bip38Worker: null
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  beforeDestroy () {
    this.bip38Worker.send('quit')
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
        this.submit()
      }
    })
  },

  methods: {
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
      let transactionData = {
        username: this.form.username,
        passphrase: this.form.passphrase,
        wif: this.form.wif
      }
      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      const transaction = await this.$client.buildDelegateRegistration(transactionData)
      this.emitNext(transaction)
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  },

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
          if (this.currentWallet.passphrase) {
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
          if (!this.currentWallet.passphrase) {
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
