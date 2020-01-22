<template>
  <form
    class="TransactionFormMultiSign flex flex-col"
    @submit.prevent
  >
    <template>
      <div
        v-if="currentWallet.isLedger"
        class="TransactionFormMultiSign__ledger-notice mt-10"
      >
        {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
      </div>

      <InputPassword
        v-else-if="currentWallet.passphrase"
        ref="password"
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
        class="TransactionFormMultiSign__password"
      />

      <PassphraseInput
        v-else
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="currentWallet.address"
        :pub-key-hash="walletNetwork.version"
        class="TransactionFormMultiSign__passphrase"
      />

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormMultiSign__second-passphrase mt-5"
      />

      <button
        :disabled="$v.form.$invalid"
        class="TransactionFormMultiSign__next blue-button mt-10 ml-0"
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
    </template>
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { InputPassword } from '@/components/Input'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import mixin from './mixin'

export default {
  name: 'TransactionFormMultiSign',

  transactionType: TRANSACTION_TYPES.MULTI_SIGN,

  components: {
    InputPassword,
    ModalLoader,
    PassphraseInput
  },

  mixins: [mixin],

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      passphrase: '',
      walletPassword: ''
    }
  }),

  methods: {
    getTransactionData () {
      const transactionData = {
        publicKey: this.currentWallet.publicKey,
        passphrase: this.form.passphrase,
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.transaction.multiSignature
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      return transactionData
    },

    async buildTransaction (transactionData) {
      return this.$client.multiSign(this.transaction, transactionData)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.MULTI_SIGN'))
    }
  },

  validations: {
    form: {
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase
    }
  }
}
</script>
