<template>
  <form
    class="TransactionEntity__container"
    @submit.prevent
  >
    <header class="mb-5">
      <h2>{{ title }}</h2>
    </header>

    <div class="my-5 px-8 py-6 leading-normal rounded bg-yellow-lighter font-medium">
      {{ $t('ENTITY.RESIGNATION_WARNING', { entity: entityTypeLabel.toLowerCase() }) }}
    </div>

    <InputText
      name="entity-name"
      :label="$t('ENTITY.NAME')"
      :is-disabled="true"
      :value="entityTransaction.data.name"
      class="mb-4"
    />

    <InputFee
      ref="fee"
      :currency="walletNetwork.token"
      :wallet="senderWallet"
      :wallet-network="walletNetwork"
      :transaction-group="$options.transactionGroup"
      :transaction-type="$options.entityAction"
      @input="onFee"
    />

    <InputPassword
      v-if="senderWallet.passphrase"
      ref="password"
      v-model="$v.form.walletPassword.$model"
      :label="$t('TRANSACTION.PASSWORD')"
      :is-required="true"
      class="TransactionFormEntityResignation__password mt-4"
    />

    <PassphraseInput
      v-else
      ref="passphrase"
      v-model="$v.form.passphrase.$model"
      :address="senderWallet.address"
      :pub-key-hash="walletNetwork.version"
      class="TransactionFormEntityResignation__passphrase mt-4"
    />

    <PassphraseInput
      v-if="senderWallet.secondPublicKey"
      ref="secondPassphrase"
      v-model="$v.form.secondPassphrase.$model"
      :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
      :pub-key-hash="walletNetwork.version"
      :public-key="senderWallet.secondPublicKey"
      class="TransactionFormEntityResignation__second-passphrase mt-5"
    />

    <button
      :disabled="$v.form.$invalid"
      class="TransactionFormEntityResignation__next blue-button mt-10 ml-0"
      @click="onSubmit"
    >
      {{ $t('COMMON.NEXT') }}
    </button>
  </form>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY, TRANSACTION_GROUPS } from '@config'
import { InputText, InputFee, InputPassword } from '@/components/Input'
import { PassphraseInput } from '@/components/Passphrase'
import mixin from '../mixin'

export default {
  name: 'TransactionFormEntityResignation',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.RESIGN,

  components: {
    InputText,
    InputFee,
    InputPassword,
    PassphraseInput
  },

  mixins: [mixin],

  props: {
    entityTransaction: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      fee: 0,
      passphrase: '',
      secondPassphrase: '',
      walletPassword: ''
    }
  }),

  computed: {
    isUndefined () {
      return this.transaction_isUndefinedResignation(this.entityTransaction.type, this.entityTransaction.typeGroup, this.entityTransaction.asset)
    },
    title () {
      return this.isUndefined ? this.$t('TRANSACTION.TYPE.UNDEFINED_RESIGNATION') : this.$t(`TRANSACTION.TYPE.${this.entityTypeLabel.toUpperCase()}_ENTITY_RESIGNATION`)
    },
    entityTypeLabel () {
      const types = {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: this.$tc('ENTITY.TYPES.BUSINESS', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: this.$tc('ENTITY.TYPES.PRODUCT', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: this.$tc('ENTITY.TYPES.PLUGIN', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: this.$tc('ENTITY.TYPES.MODULE', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: this.$tc('ENTITY.TYPES.DELEGATE', 1)
      }
      return types[this.entityTransaction.type] || this.$t('TRANSACTION.TYPE.UNDEFINED')
    },

    senderWallet () {
      return this.$store.getters['wallet/byAddress'](this.entityTransaction.address)
    },

    currentWallet () {
      return this.senderWallet
    }
  },

  methods: {
    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    async getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }

      const { type, subType, id: registrationId } = this.entityTransaction

      return {
        ...transactionData,
        asset: {
          type,
          subType,
          action: +this.$options.entityAction,
          registrationId,
          data: {}
        }
      }
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildEntity(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.ENTITY_RESIGNATION', { entity: this.entityTypeLabel }))
    },

    emitNext (transaction) {
      this.$emit('next', {
        transaction: {
          ...transaction,
          entityTransaction: this.entityTransaction
        },
        wallet: this.senderWallet
      })
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      secondPassphrase: mixin.validators.secondPassphrase,
      walletPassword: mixin.validators.walletPassword
    }
  }
}
</script>
