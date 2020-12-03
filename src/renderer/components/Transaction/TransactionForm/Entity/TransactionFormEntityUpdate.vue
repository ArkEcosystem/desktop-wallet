<template>
  <form
    class="TransactionEntity__container"
    @submit.prevent
  >
    <header class="mb-2">
      <h2>{{ title }}</h2>
      <p class="mt-1 text-theme-page-text-light">
        {{ $t('ENTITY.REGISTRATION_STEP2_DESCRIPTION' ) }}
      </p>
    </header>

    <EntityForm
      ref="entity"
      :entity-name="entityName"
      :ipfs-data-object="ipfsDataObject"
      @change="onEntityForm"
    >
      <ListDividedItem
        label=""
        item-value-class="w-full"
      >
        <InputFee
          ref="fee"
          :currency="walletNetwork.token"
          :wallet="senderWallet"
          :wallet-network="walletNetwork"
          :transaction-group="$options.transactionGroup"
          :transaction-type="entityActionType"
          @input="onFee"
        />
      </ListDividedItem>
    </EntityForm>

    <InputPassword
      v-if="senderWallet && senderWallet.passphrase"
      ref="password"
      v-model="$v.form.walletPassword.$model"
      :label="$t('TRANSACTION.PASSWORD')"
      :is-required="true"
      class="TransactionFormEntityUpdate__password mt-4"
    />

    <PassphraseInput
      v-else-if="senderWallet"
      ref="passphrase"
      v-model="$v.form.passphrase.$model"
      :address="senderWallet.address"
      :pub-key-hash="walletNetwork.version"
      class="TransactionFormEntityUpdate__passphrase mt-4"
    />

    <PassphraseInput
      v-if="senderWallet && senderWallet.secondPublicKey"
      ref="secondPassphrase"
      v-model="$v.form.secondPassphrase.$model"
      :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
      :pub-key-hash="walletNetwork.version"
      :public-key="senderWallet.secondPublicKey"
      class="TransactionFormEntityUpdate__second-passphrase mt-5"
    />

    <footer class="mt-10 flex justify-between items-center">
      <div class="self-start">
        <button
          :disabled="isSubmitting || !isStepValid"
          class="TransactionFormEntityRegistration__next blue-button"
          @click="onSubmit"
        >
          <Loader
            v-if="isSubmitting"
            size="10px"
          />
          <span v-else>{{ $t('COMMON.NEXT') }}</span>
        </button>
      </div>
    </footer>

    <ModalLoader
      ref="modalLoader"
      :message="$t('ENCRYPTION.DECRYPTING')"
      :visible="showEncryptLoader"
    />
  </form>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY, TRANSACTION_GROUPS } from '@config'
import { InputFee, InputPassword } from '@/components/Input'
import { ListDividedItem } from '@/components/ListDivided'
import { PassphraseInput } from '@/components/Passphrase'
import { ModalLoader } from '@/components/Modal'
import Loader from '@/components/utils/Loader'

import { File } from '@arkecosystem/platform-sdk-ipfs'
import { Request } from '@arkecosystem/platform-sdk-http-got'
import { filter, isEmpty } from '@arkecosystem/utils'
import EntityForm from './EntityForm'
import mixin from '../mixin'

export default {
  name: 'TransactionFormEntityUpdate',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.UPDATE,

  components: {
    EntityForm,
    InputFee,
    InputPassword,
    ListDividedItem,
    Loader,
    ModalLoader,
    PassphraseInput
  },

  mixins: [mixin],

  props: {
    delegate: {
      type: Object,
      required: false,
      default: undefined
    },
    entityTransaction: {
      type: Object,
      required: false,
      default: undefined
    },
    ipfsDataObject: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    form: {
      fee: 0,
      passphrase: '',
      secondPassphrase: '',
      walletPassword: ''
    },
    entityForm: {}
  }),

  computed: {
    entityName () {
      if (this.entityTransaction) {
        return this.entityTransaction.data.name
      }

      if (this.delegate) {
        return this.delegate.username
      }

      return undefined
    },

    entityType () {
      return this.entityTransaction ? this.entityTransaction.type : TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE
    },

    entitySubType () {
      return this.entityTransaction ? this.entityTransaction.subType : TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
    },

    entityActionType () {
      return !this.entityTransaction ? TRANSACTION_TYPES_ENTITY.ACTION.REGISTER : TRANSACTION_TYPES_ENTITY.ACTION.UPDATE
    },

    senderAddress () {
      return this.delegate ? this.delegate.address : this.entityTransaction.address
    },

    isUndefined () {
      if (this.entityTransaction) {
        return this.transaction_isUndefinedUpdate(this.entityTransaction.type, this.entityTransaction.typeGroup, this.entityTransaction.asset)
      }

      return false
    },

    title () {
      return this.isUndefined ? this.$t('TRANSACTION.TYPE.UNDEFINED_UPDATE') : this.$t(`TRANSACTION.TYPE.${this.entityTypeLabel.toUpperCase()}_ENTITY_UPDATE`)
    },

    entityTypeLabel () {
      const types = {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: this.$tc('ENTITY.TYPES.BUSINESS', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: this.$tc('ENTITY.TYPES.PRODUCT', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: this.$tc('ENTITY.TYPES.PLUGIN', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: this.$tc('ENTITY.TYPES.MODULE', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: this.$tc('ENTITY.TYPES.DELEGATE', 1)
      }
      return types[this.entityType]
    },

    isStepValid () {
      return !this.$v.$invalid
    },

    senderWallet () {
      return this.$store.getters['wallet/byAddress'](this.senderAddress)
    },

    currentWallet () {
      return this.senderWallet
    }
  },

  methods: {
    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    onEntityForm (value) {
      this.entityForm = value
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

      const { ipfsData, entityName } = this.entityForm
      const sanitizedIpfsData = filter(ipfsData, (item) => !isEmpty(item))
      const hash = await new File(new Request()).upload(sanitizedIpfsData)

      const asset = {
        type: this.entityType,
        subType: this.entitySubType,
        action: this.entityActionType,
        data: {
          ipfsData: hash
        }
      }

      if (this.entityTransaction) {
        asset.registrationId = this.entityTransaction.id
      } else {
        asset.data.name = entityName
      }

      return {
        ...transactionData,
        asset
      }
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildEntity(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.ENTITY_UPDATE', { entity: this.entityTypeLabel }))
    },

    emitNext (transaction) {
      this.$emit('next', {
        transaction: {
          ...transaction,
          entityForm: this.entityForm
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

<style lang="postcss">
.TransactionModalEntity {
  min-width: 38rem;
  max-width: 38rem!important;
  max-height: 80vh;
}
</style>
