<template>
  <form
    class="TransactionFormDelegateRegistration flex flex-col"
    @submit.prevent
  >
    <template v-if="!currentWallet.isDelegate">
      <ListDivided :is-floating-label="true">
        <ListDividedItem :label="$t('TRANSACTION.SENDER')">
          {{ senderLabel }}
          <span
            v-if="senderLabel !== currentWallet.address"
            class="text-sm text-theme-page-text-light"
          >
            {{ currentWallet.address }}
          </span>
        </ListDividedItem>
      </ListDivided>

      <InputText
        v-model="$v.form.username.$model"
        :helper-text="error"
        :label="$t('WALLET_DELEGATES.USERNAME')"
        :is-invalid="$v.form.username.$dirty && $v.form.username.$invalid"
        class="mb-5"
        name="username"
      />

      <InputFee
        v-if="walletNetwork.apiVersion === 2"
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
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
        :pub-key-hash="walletNetwork.version"
      />

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
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
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'
import onSubmit from './mixin-on-submit'

export default {
  name: 'TransactionFormDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  components: {
    InputFee,
    InputPassword,
    InputText,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput
  },

  mixins: [onSubmit],

  data: () => ({
    form: {
      fee: 0,
      username: '',
      passphrase: '',
      walletPassword: ''
    },
    error: null,
    showEncryptLoader: false,
    showLedgerLoader: false
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    },

    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    walletNetwork () {
      return this.session_network
    }
  },

  mounted () {
    // Set default fees with v1 compatibility
    if (this.walletNetwork.apiVersion === 1) {
      this.form.fee = V1.fees[this.$options.transactionType] / 1e8
    } else {
      this.form.fee = this.$refs.fee.fee
    }
  },

  methods: {
    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    async submit () {
      // Ensure that fee has value, even when the user has not interacted
      if (!this.form.fee) {
        this.$set(this.form, 'fee', this.$refs.fee.fee)
      }

      const transactionData = {
        username: this.form.username,
        passphrase: this.form.passphrase,
        fee: parseInt(this.currency_unitToSub(this.form.fee)),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif
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
      this.$emit('next', { transaction })
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
          return this.walletNetwork.apiVersion === 1 // Return true if it's v1, since it has a static fee
        }
      },
      username: {
        isValid (value) {
          const validation = WalletService.validateUsername(value)

          if (validation.passes) {
            this.error = null
          } else {
            switch (validation.errors[0].type) {
              case 'empty':
                this.error = this.$t('WALLET_DELEGATES.USERNAME_EMPTY_ERROR')
                break
              case 'maxLength':
                this.error = this.$t('WALLET_DELEGATES.USERNAME_MAX_LENGTH_ERROR')
                break
              default:
                this.error = this.$t('WALLET_DELEGATES.USERNAME_ERROR')
            }
          }

          return validation.passes
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
