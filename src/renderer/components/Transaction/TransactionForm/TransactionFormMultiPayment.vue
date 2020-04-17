<template>
  <form
    class="TransactionFormMultiPayment flex flex-col"
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
        class="TransactionFormMultiPayment__recipient mb-5 mr-4 flex-1"
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
          class="TransactionFormMultiPayment__amount flex-1"
        />

        <ButtonGeneric
          :disabled="!validStep1"
          :label="$t('TRANSACTION.MULTI_PAYMENT.BUTTON_ADD')"
          class="TransactionFormMultiPayment__add py-1 flex-inline h-8 mt-4 ml-4"
          @click="addRecipient"
        />
      </div>

      <TransactionMultiPaymentList
        :items="$v.form.recipients.$model"
        :max-items="maximumRecipients"
        :show-count="true"
        :is-invalid="hasMoreThanMaximumRecipients"
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
        class="TransactionFormMultiPayment__vendorfield mb-5"
      />

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="transactionTypeFee"
        :is-disabled="!currentWallet"
        :wallet="currentWallet"
        :wallet-network="walletNetwork"
        class="TransactionFormMultiPayment__fee"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet.isLedger"
          class="TransactionFormMultiPayment__ledger-notice mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
          class="TransactionFormMultiPayment__password mt-4"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          :is-disabled="!currentWallet"
          class="TransactionFormMultiPayment__passphrase mt-4"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormMultiPayment__second-passphrase mt-5"
      />
    </div>

    <footer class="mt-4 flex justify-between items-center">
      <div class="self-start">
        <button
          v-if="step === 2"
          class="TransactionFormMultiPayment__prev blue-button"
          @click="previousStep"
        >
          {{ $t('COMMON.PREV') }}
        </button>

        <button
          :disabled="!isFormValid"
          class="TransactionFormMultiPayment__next blue-button"
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

  data: () => ({
    step: 1,
    recipientId: '',
    amount: '',
    form: {
      recipientId: '', // normal transaction
      amount: '', // normal transaction
      recipients: [], // multipayment transaction
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

    isMultiPayment () {
      return this.form.recipients.length > 1
    },

    hasMoreThanMaximumRecipients () {
      return this.form.recipients.length > this.maximumRecipients
    },

    transactionTypeFee () {
      return this.isMultiPayment ? TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT : TRANSACTION_TYPES.GROUP_1.TRANSFER
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
      let availableAmount = this.currency_subToUnit(this.currentWallet.balance).minus(this.form.fee)

      for (const recipient of this.form.recipients) {
        availableAmount = availableAmount.minus(this.currency_subToUnit(recipient.amount))
      }

      return availableAmount
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

      if (!this.isMultiPayment) {
        transactionData.recipientId = this.form.recipientId
        transactionData.amount = this.form.amount
        transactionData.networkId = this.walletNetwork.id
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      return transactionData
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      if (this.isMultiPayment) {
        return this.$client.buildMultiPayment(transactionData, isAdvancedFee, returnObject)
      } else {
        return this.$client.buildTransfer(transactionData, isAdvancedFee, returnObject)
      }
    },

    transactionError () {
      if (this.isMultiPayment) {
        this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.MULTI_PAYMENT'))
      } else {
        this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.TRANSFER'))
      }
    },

    addRecipient () {
      if (this.$v.recipientId.$invalid || this.$v.amount.$invalid) {
        return
      }

      // normal transaction
      this.$v.form.recipientId.$model = this.recipientId
      this.$v.form.amount.$model = this.currency_unitToSub(this.amount)

      // multipayment transaction
      this.$v.form.recipients.$model.push({
        address: this.recipientId,
        amount: this.currency_unitToSub(this.amount)
      })

      this.$refs.recipient.reset()
      this.$v.recipientId.$reset()
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

    emitRemoveRecipient (index) {
      if (!Object.prototype.hasOwnProperty.call(this.$v.form.recipients.$model, index)) {
        return
      }

      this.$v.form.recipients.$model = [
        ...this.form.recipients.slice(0, index),
        ...this.form.recipients.slice(index + 1)
      ]

      if (!this.isMultiPayment) {
        if (Object.prototype.hasOwnProperty.call(this.$v.form.recipients.$model, 0)) {
          this.$v.form.recipientId.$model = this.$v.form.recipients.$model[0].address
          this.$v.form.amount.$model = this.$v.form.recipients.$model[0].amount
        } else {
          this.$v.form.recipientId.$model = ''
          this.$v.form.amount.$model = ''
        }
      }
    }
  },

  validations: {
    recipientId: {
      required,
      isValid () {
        if (this.$refs.recipient) {
          return !this.$refs.recipient.$v.$invalid
        }

        return false
      }
    },

    amount: {
      required,
      isValid () {
        if (this.$refs.amount) {
          return !this.$refs.amount.$v.$invalid
        }

        return false
      }
    },

    form: {
      recipientId: {},
      amount: {},
      recipients: {
        aboveMinimum () {
          return this.form.recipients.length >= 1
        },

        belowOrEqualMaximum () {
          return this.form.recipients.length <= this.maximumRecipients
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
