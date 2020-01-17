<template>
  <form
    class="TransactionFormBusinessResignation flex flex-col"
    @submit.prevent
  >
    <template v-if="canResignBusiness">
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

        <ListDividedItem :label="$t('TRANSACTION.BUSINESS_NAME')">
          {{ currentWallet.business.name }}
        </ListDividedItem>
      </ListDivided>

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-group="$options.transactionGroup"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
        class="TransactionFormBusinessResignation__fee"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet.isLedger"
          class="TransactionFormBusinessResignation__ledger-notice mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
          class="TransactionFormBusinessResignation__password"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          class="TransactionFormBusinessResignation__passphrase"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormBusinessResignation__second-passphrase mt-5"
      />

      <button
        :disabled="$v.form.$invalid"
        class="TransactionFormBusinessResignation__next blue-button mt-10 ml-0"
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
          {{ $t('TRANSACTION.FOOTER_TEXT.BUSINESS_RESIGNATION') }}
        </footer>
      </Portal>
    </template>
    <template v-else>
      {{ $t('WALLET_BUSINESS.NOT_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { InputFee, InputPassword } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'
import mixin from '../mixin'

export default {
  name: 'TransactionFormBusinessResignation',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION,

  components: {
    InputFee,
    InputPassword,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput
  },

  mixins: [mixin],

  data: () => ({
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: ''
    }
  }),

  computed: {
    canResignBusiness () {
      return WalletService.canResignBusiness(this.currentWallet)
    }
  },

  methods: {
    getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
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
      return this.$client.buildBusinessResignation(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.BUSINESS_RESIGNATION'))
    }
  },

  validations: {
    form: {
      fee: mixin.validators.secondPassphrase,
      passphrase: mixin.validators.secondPassphrase,
      walletPassword: mixin.validators.secondPassphrase,
      secondPassphrase: mixin.validators.secondPassphrase
    }
  }
}
</script>
