<template>
  <form
    class="TransactionFormDelegateRegistration flex flex-col"
    @submit.prevent
  >
    <template v-if="!currentWallet.isDelegate">
      <ListDivided :is-floating-label="true">
        <ListDividedItem
          :label="$t('TRANSACTION.SENDER')"
          item-value-class="w-full"
        >
          <span class="break-words">
            {{ senderLabel }}
          </span>
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
        :helper-text="usernameError"
        :label="$t('WALLET_DELEGATES.USERNAME')"
        :is-invalid="!!usernameError"
        class="TransactionFormDelegateRegistration__username mb-5"
        name="username"
      />

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
        class="TransactionFormDelegateRegistration__fee"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet.isLedger"
          class="TransactionFormDelegateRegistration__ledger-notice mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
          class="TransactionFormDelegateRegistration__password mt-4"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          class="TransactionFormDelegateRegistration__passphrase mt-4"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormDelegateRegistration__second-passphrase mt-5"
      />

      <button
        :disabled="$v.form.$invalid"
        class="TransactionFormDelegateRegistration__next blue-button mt-10 ml-0"
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
import { TRANSACTION_TYPES } from '@config'
import { InputFee, InputPassword, InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'
import mixin from './mixin'

export default {
  name: 'TransactionFormDelegateRegistration',

  transactionType: TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION,

  components: {
    InputFee,
    InputPassword,
    InputText,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput
  },

  mixins: [mixin],

  data: () => ({
    form: {
      fee: 0,
      username: '',
      passphrase: '',
      walletPassword: ''
    }
  }),

  computed: {
    usernameError () {
      if (this.$v.form.username.$dirty && this.$v.form.username.$error) {
        if (!this.$v.form.username.isNotEmpty) {
          return this.$t('WALLET_DELEGATES.USERNAME_EMPTY_ERROR')
        } else if (!this.$v.form.username.isMaxLength) {
          return this.$t('WALLET_DELEGATES.USERNAME_MAX_LENGTH_ERROR')
        } else if (!this.$v.form.username.doesNotExist) {
          return this.$t('WALLET_DELEGATES.USERNAME_EXISTS')
        }

        return this.$t('WALLET_DELEGATES.USERNAME_ERROR')
      }

      return null
    }
  },

  methods: {
    getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        username: this.form.username,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      return transactionData
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildDelegateRegistration(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.DELEGATE_REGISTRATION'))
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase,

      username: {
        isValid (value) {
          const validation = WalletService.validateUsername(value)

          return validation.passes
        },

        isNotEmpty (value) {
          const validation = WalletService.validateUsername(value)

          return !validation.passes ? !validation.errors.find(error => error.type === 'empty') : true
        },

        isMaxLength (value) {
          const validation = WalletService.validateUsername(value)

          return !validation.passes ? !validation.errors.find(error => error.type === 'maxLength') : true
        },

        doesNotExist (value) {
          const validation = WalletService.validateUsername(value)

          return !validation.passes ? !validation.errors.find(error => error.type === 'exists') : true
        }
      }
    }
  }
}
</script>
