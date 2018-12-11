<template>
  <form
    class="TransactionFormDelegateRegistration flex flex-col"
    @submit.prevent
  >
    <template v-if="!currentWallet.isDelegate">
      <div class="mb-5">
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

      <InputFee
        v-if="session_network.apiVersion === 2"
        ref="fee"
        :currency="session_network.token"
        :transaction-type="$options.transactionType"
        :show-insufficent-funds="true"
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
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
      />
      <PassphraseInput
        v-else
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

      <ModalLoader
        ref="modalLoader"
        :message="$t('ENCRYPTION.DECRYPTING')"
        :visible="showEncryptLoader"
      />
      <ModalLoader
        :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
        :visible="showLedgerLoader"
      />

      <Portal to="transaction-footer">
        <footer class="ModalWindow__container__footer--warning">
          {{ $t('TRANSACTION.FOOTER_TEXT.DELEGATE_REGISTRATION') }}
        </footer>
      </Portal>
    </template>
    <template v-else>
      {{ $t('WALLET_DELEGATES.ALREADY_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES, V1 } from '@config'
import { InputFee, InputPassword, InputText } from '@/components/Input'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionFormDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  components: {
    InputFee,
    InputPassword,
    InputText,
    ModalLoader,
    PassphraseInput
  },

  data: () => ({
    form: {
      username: '',
      passphrase: '',
      walletPassword: ''
    },
    error: null,
    showEncryptLoader: false,
    showLedgerLoader: false,
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
    onFee (fee) {
      this.$set(this.form, 'fee', fee)
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
      if (this.session_network.apiVersion === 1) {
        this.$set(this.form, 'fee', V1.fees[this.$options.transactionType])
      }
      // Ensure that fee has value, even when the user has not interacted
      if (!this.form.fee) {
        this.$set(this.form, 'fee', this.$refs.fee.fee)
      }

      const transactionData = {
        username: this.form.username,
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
        transaction = await this.$client.buildDelegateRegistration(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)
      } else {
        success = false
        this.showLedgerLoader = true
        try {
          const transactionObject = await this.$client.buildDelegateRegistration(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee, true)
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
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  },

  validations: {
    form: {
      fee: {
        required,
        isValid () {
          if (this.$refs.fee) {
            return !this.$refs.fee.$v.$invalid
          }
          return this.session_network.apiVersion === 1 // Return true if it's v1, since it has a static fee
        }
      },
      username: {
        required,
        isValid (value) {
          const validation = WalletService.validateUsername(value)
          if (validation && validation.passes) {
            this.error = null
            return validation.passes
          }

          if (validation.errors && validation.errors.length) {
            const { type } = validation.errors[0]
            if (type === 'string.max') {
              this.error = this.$t('WALLET_DELEGATES.USERNAME_MAX_LENGTH_ERROR')
            } else {
              this.error = this.$t('WALLET_DELEGATES.USERNAME_ERROR')
            }
          } else {
            this.error = this.$t('WALLET_DELEGATES.USERNAME_ERROR')
          }

          return false
        }
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
