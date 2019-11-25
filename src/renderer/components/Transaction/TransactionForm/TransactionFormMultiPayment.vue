<template>
  <form
    class="flex flex-col"
    @submit.prevent
  >
    <ListDivided
      v-if="senderLabel"
      :is-floating-label="true"
    >
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

    <div
      v-if="step === 1"
    >
      <InputAddress
        ref="recipient"
        v-model="$v.recipientId.$model"
        :label="$t('TRANSACTION.RECIPIENT')"
        :pub-key-hash="walletNetwork.version"
        :show-suggestions="true"
        :is-disabled="!currentWallet"
        :warning-text="recipientWarning"
        name="recipientId"
        class="mb-5 mr-4 flex-1"
      />

      <div
        class="flex"
      >
        <InputCurrency
          ref="amount"
          v-model="$v.amount.$model"
          :alternative-currency="alternativeCurrency"
          :currency="walletNetwork.token"
          :is-invalid="$v.amount.$dirty && $v.amount.$invalid"
          :label="$t('TRANSACTION.AMOUNT')"
          :minimum-error="amountTooLowError"
          :minimum-amount="minimumAmount"
          :maximum-amount="maximumAvailableAmount"
          :maximum-error="notEnoughBalanceError"
          :required="true"
          :is-disabled="!currentWallet"
          :wallet-network="walletNetwork"
          class="flex-1"
        />

        <ButtonGeneric
          :disabled="!validStep1"
          :label="$t('TRANSACTION.MULTI_PAYMENT.BUTTON_ADD')"
          class="py-1 flex-inline h-8 mt-4 ml-4"
          @click="addRecipient"
        />
      </div>

      <TransactionMultiPaymentList
        :items="$v.form.recipients.$model"
        :required="true"
        class="TransactionModalMultiPayment__recipients mt-4"
        @remove="emitRemoveRecipient"
      />
    </div>

    <div v-if="step === 2">
      <InputText
        ref="vendorField"
        v-model="$v.form.vendorField.$model"
        :label="vendorFieldLabel"
        :bip39-warning="true"
        :helper-text="vendorFieldHelperText"
        :maxlength="vendorFieldMaxLength"
        name="vendorField"
        class="mb-5"
      />

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="$options.transactionType"
        :is-disabled="!currentWallet"
        :wallet="currentWallet"
        :wallet-network="walletNetwork"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet && currentWallet.isLedger"
          class="mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet && currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          class="mt-4"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          class="mt-4"
          :address="currentWallet && currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          :is-disabled="!currentWallet"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet && currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="mt-5"
      />
    </div>

    <footer class="mt-4 flex justify-between items-center">
      <div class="self-start">
        <button
          :disabled="step === 1"
          class="blue-button"
          @click="previousStep"
        >
          {{ $t('COMMON.PREV') }}
        </button>

        <button
          :disabled="!isFormValid"
          class="blue-button"
          @click="nextStep"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </div>
    </footer>

    <ModalLoader
      :message="$t('ENCRYPTION.DECRYPTING')"
      :visible="showEncryptLoader"
    />
    <ModalLoader
      :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
      :visible="showLedgerLoader"
    />
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES, VENDOR_FIELD } from '@config'
import { ButtonGeneric } from '@/components/Button'
import { InputAddress, InputCurrency, InputPassword, InputText, InputFee } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionMultiPaymentList from '@/components/Transaction/TransactionMultiPaymentList'
import mixin from './mixin'

export default {
  name: 'TransactionFormMultiPayment',

  transactionType: TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT,

  components: {
    ButtonGeneric,
    InputAddress,
    InputCurrency,
    InputPassword,
    InputText,
    InputFee,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput,
    TransactionMultiPaymentList
  },

  mixins: [mixin],

  data: vm => ({
    step: 1,
    amount: '',
    recipientId: '',
    form: {
      recipients: [],
      fee: 0,
      passphrase: '',
      walletPassword: '',
      vendorField: ''
    }
  }),

  computed: {
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },

    validStep1 () {
      if (!this.$v.recipientId.$dirty || this.$v.recipientId.$invalid) {
        return false
      }

      if (!this.$v.amount.$dirty || this.$v.amount.$invalid) {
        return false
      }

      return true
    },

    isFormValid () {
      if (this.step === 1) {
        return !this.$v.form.recipients.$invalid
      }

      return !this.$v.form.$invalid
    },

    // Customize the message to display the minimum amount as subunit
    amountTooLowError () {
      const { fractionDigits } = this.walletNetwork
      const minimumAmount = Math.pow(10, -fractionDigits)

      return this.$t('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', {
        amount: this.currency_simpleFormatCrypto(minimumAmount.toFixed(fractionDigits))
      })
    },

    notEnoughBalanceError () {
      return this.$t('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', {
        balance: this.formatter_networkCurrency(this.currentWallet.balance)
      })
    },

    minimumAmount () {
      return this.currency_subToUnit(1)
    },

    maximumAvailableAmount () {
      return this.currency_subToUnit(this.currentWallet.balance).minus(this.form.fee)
    },

    walletNetwork () {
      const sessionNetwork = this.session_network
      const profile = this.$store.getters['profile/byId'](this.currentWallet.profileId)
      if (!profile.id) {
        return sessionNetwork
      }

      return this.$store.getters['network/byId'](profile.networkId) || sessionNetwork
    },

    vendorFieldLabel () {
      return `${this.$t('TRANSACTION.VENDOR_FIELD')} - ${this.$t('VALIDATION.MAX_LENGTH', [this.vendorFieldMaxLength])}`
    },

    vendorFieldHelperText () {
      const vendorFieldLength = this.form.vendorField.length

      if (vendorFieldLength === this.vendorFieldMaxLength) {
        return this.$t('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [this.vendorFieldMaxLength])
      } else if (vendorFieldLength) {
        return this.$t('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
          this.vendorFieldMaxLength - vendorFieldLength,
          this.vendorFieldMaxLength
        ])
      }

      return null
    },

    vendorFieldMaxLength () {
      const vendorField = this.walletNetwork.vendorField

      if (vendorField) {
        return vendorField.maxLength
      }

      return VENDOR_FIELD.defaultMaxLength
    },

    recipientWarning () {
      if (!this.$v.recipientId.$dirty) {
        return null
      }

      if (this.form.recipients.some(recipient => recipient.address === this.$v.recipientId.$model)) {
        return this.$t('TRANSACTION.MULTI_PAYMENT.WARNING_DUPLICATE')
      }

      return null
    },

    maximumRecipients () {
      if (!this.session_network.constants || !this.session_network.constants.multiPaymentLimit) {
        return 500
      }

      return this.session_network.constants.multiPaymentLimit
    }
  },

  mounted () {
    this.$v.recipientId.$touch()
  },

  methods: {
    getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        recipients: this.form.recipients,
        vendorField: this.form.vendorField,
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
      return this.$client.buildMultiPayment(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.MULTI_PAYMENT'))
    },

    addRecipient () {
      console.log('addRecipient', {
        address: this.recipientId,
        amount: this.currency_unitToSub(this.amount)
      })

      this.form.recipients.push({
        address: this.recipientId,
        amount: this.currency_unitToSub(this.amount)
      })

      this.$refs.recipient.reset()
      this.$v.amount.$model = ''
      this.$refs.amount.reset()
    },

    previousStep () {
      if (this.step === 2) {
        this.step = 1
      }
    },

    nextStep () {
      if (this.step === 1) {
        this.step = 2
      } else {
        this.form.fee = this.$refs.fee.fee
        this.onSubmit()
      }
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    setSendAll (isActive, setPreviousAmount = true) {
      if (isActive) {
        this.confirmSendAll()
        this.previousAmount = this.form.amount
      }
      if (!isActive) {
        if (setPreviousAmount && !this.previousAmount && this.previousAmount.length) {
          this.$set(this.form, 'amount', this.previousAmount)
        }
        this.previousAmount = ''
        this.isSendAllActive = isActive
      }
    },

    emitRemoveRecipient (index) {
      this.$v.form.recipients.$model = [
        ...this.form.recipients.slice(0, index),
        ...this.form.recipients.slice(index + 1)
      ]
    }
  },

  validations: {
    recipientId: {
      required,
      isValid (value) {
        if (this.$refs.recipient) {
          return !this.$refs.recipient.$v.$invalid
        }

        return false
      }
    },

    amount: {
      required,
      isValid (value) {
        if (this.$refs.amount) {
          return !this.$refs.amount.$v.$invalid
        }

        return false
      }
    },

    form: {
      recipients: {
        notEmpty () {
          return !!this.form.recipients.length
        },

        aboveMinimum () {
          return this.form.recipients.length > 1
        },

        belowMaximum () {
          return this.form.recipients.length < this.maximumRecipients
        }
      },
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      secondPassphrase: mixin.validators.secondPassphrase,
      vendorField: {},
      walletPassword: mixin.validators.walletPassword
    }
  }
}
</script>

<style>
.TransactionModalMultiPayment__recipients .InputEditableList__list {
  max-height: 13rem;
}
</style>
