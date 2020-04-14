<template>
  <form
    class="TransactionFormDelegateResignation flex flex-col"
    @submit.prevent
  >
    <template v-if="canResign">
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

        <ListDividedItem :label="$t('TRANSACTION.USERNAME')">
          {{ username }}
        </ListDividedItem>
      </ListDivided>

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
        class="TransactionFormDelegateResignation__fee"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet.isLedger"
          class="TransactionFormDelegateResignation__ledger-notice mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
          class="TransactionFormDelegateResignation__password mt-4"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          class="TransactionFormDelegateResignation__passphrase mt-4"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormDelegateResignation__second-passphrase mt-5"
      />

      <button
        :disabled="$v.form.$invalid"
        class="TransactionFormDelegateResignation__next blue-button mt-10 ml-0"
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
          {{ $t('TRANSACTION.FOOTER_TEXT.DELEGATE_RESIGNATION') }}
        </footer>
      </Portal>
    </template>
    <template v-else>
      {{ $t('WALLET_DELEGATES.NOT_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { InputFee, InputPassword } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import mixin from './mixin'

export default {
  name: 'TransactionFormDelegateResignation',

  transactionType: TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION,

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
    canResign () {
      if (this.username === null) {
        return false
      }

      return this.currentWallet.isDelegate
    },

    username () {
      const delegate = this.$store.getters['delegate/byAddress'](this.currentWallet.address)

      if (!delegate || !delegate.username) {
        return null
      }

      return this.$store.getters['delegate/byAddress'](this.currentWallet.address).username
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
      return this.$client.buildDelegateResignation(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.DELEGATE_RESIGNATION'))
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase
    }
  }
}
</script>
