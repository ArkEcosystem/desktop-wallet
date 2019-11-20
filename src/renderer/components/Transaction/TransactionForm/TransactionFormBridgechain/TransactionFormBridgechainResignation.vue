<template>
  <form
    class="TransactionFormBridgechainResignation flex flex-col"
    @submit.prevent
  >
    <template v-if="!bridgechain.isResigned">
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

        <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.NAME')">
          {{ bridgechain.name }}
        </ListDividedItem>
      </ListDivided>

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-group="$options.transactionGroup"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
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
      </div>

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
          {{ $t('TRANSACTION.FOOTER_TEXT.BRIDGECHAIN_RESIGNATION') }}
        </footer>
      </Portal>
    </template>
    <template v-else>
      {{ $t('WALLET_BUSINESS.BRIDGECHAIN.NOT_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { InputFee, InputPassword } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import mixin from '../mixin'

export default {
  name: 'TransactionFormBridgechainResignation',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION,

  components: {
    InputFee,
    InputPassword,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput
  },

  mixins: [mixin],

  props: {
    bridgechain: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: ''
    }
  }),

  methods: {
    getTransactionData () {
      const transactionData = {
        bridgechainId: this.bridgechain.genesisHash,
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
      return this.$client.buildBridgechainResignation(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_RESIGNATION'))
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
