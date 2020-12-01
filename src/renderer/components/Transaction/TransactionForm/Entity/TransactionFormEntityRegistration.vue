<template>
  <form
    class="p-16"
    :class="{
      'TransactionEntity__container': step === 2
    }"
    @submit.prevent
  >
    <div v-show="step === 1">
      <header class="mb-5">
        <h2>{{ $t('ENTITY.REGISTRATION') }}</h2>
        <p class="mt-1 text-theme-page-text-light">
          {{ $t('ENTITY.REGISTRATION_STEP1_DESCRIPTION') }}
        </p>
      </header>

      <InputSelect
        v-model="$v.step1.sender.$model"
        :label="$t('TRANSACTION.SENDER')"
        :items="walletList"
        name="sender"
        class="TransactionFormEntityRegistration__sender mb-5"
      />

      <InputSelect
        v-model="$v.step1.registrationType.$model"
        :items="registrationTypesOptions"
        :is-disabled="!step1.sender"
        :label="$t('ENTITY.REGISTRATION_TYPE')"
        name="registrationType"
        class="mb-5"
      />
    </div>

    <div v-show="step === 2">
      <header class="mb-2">
        <h2>{{ formTitle }}</h2>
        <p class="mt-1 text-theme-page-text-light">
          {{ $t('ENTITY.REGISTRATION_STEP2_DESCRIPTION' ) }}
        </p>
      </header>

      <EntityForm
        ref="entity"
        :entity-name="delegateUsername"
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
            :transaction-type="$options.entityAction"
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
        class="TransactionFormEntityRegistration__password mt-4"
      />

      <PassphraseInput
        v-else-if="senderWallet"
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="senderWallet.address"
        :pub-key-hash="walletNetwork.version"
        class="TransactionFormEntityRegistration__passphrase mt-4"
      />

      <PassphraseInput
        v-if="senderWallet && senderWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="senderWallet.secondPublicKey"
        class="TransactionFormEntityRegistration__second-passphrase mt-5"
      />
    </div>

    <footer class="mt-10 flex justify-between items-center">
      <div class="self-start">
        <button
          v-if="step !== 1"
          class="TransactionFormEntityRegistration__prev blue-button"
          @click="previousStep"
        >
          {{ $t('COMMON.PREV') }}
        </button>

        <button
          :disabled="isSubmitting || !isStepValid"
          class="TransactionFormEntityRegistration__next blue-button"
          @click="nextStep"
        >
          <Loader
            v-if="isSubmitting"
            size="10px"
          />
          <span v-else>{{ $t('COMMON.NEXT') }}</span>
        </button>
      </div>
    </footer>
  </form>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY, TRANSACTION_GROUPS } from '@config'
import { InputSelect, InputFee, InputPassword } from '@/components/Input'
import { required } from 'vuelidate/lib/validators'
import { ListDividedItem } from '@/components/ListDivided'
import { PassphraseInput } from '@/components/Passphrase'
import Loader from '@/components/utils/Loader'
import { File } from '@arkecosystem/platform-sdk-ipfs'
import { Request } from '@arkecosystem/platform-sdk-http-got'
import { filter, isEmpty } from '@arkecosystem/utils'
import EntityForm from './EntityForm'
import mixin from '../mixin'
import truncate from '@/filters/truncate'
import { orderBy } from 'lodash'

export default {
  name: 'TransactionFormEntityRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.REGISTER,

  components: {
    EntityForm,
    InputSelect,
    InputFee,
    InputPassword,
    ListDividedItem,
    Loader,
    PassphraseInput
  },

  mixins: [mixin],

  data: () => ({
    step: 1,
    form: {
      fee: 0,
      passphrase: '',
      secondPassphrase: '',
      walletPassword: ''
    },
    step1: {
      sender: '',
      registrationType: '0'
    },
    step2: {}
  }),

  computed: {
    wallets () {
      const result = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      return result.filter(wallet => !wallet.isLedger && !wallet.multiSignature)
    },

    walletList () {
      const addresses = this.wallets.map(wallet => {
        const address = {
          name: null,
          address: wallet.address
        }

        const walletName = this.wallet_name(wallet.address)
        if (walletName && walletName !== wallet.address) {
          address.name = `${truncate(walletName, 25)} (${this.wallet_truncate(wallet.address)})`
        }

        return address
      })

      const results = orderBy(addresses, (object) => {
        return object.name || object.address.toLowerCase()
      })

      return results.reduce((wallets, wallet) => {
        const value = wallet.name || wallet.address
        wallets[wallet.address] = value

        return wallets
      }, {})
    },

    formTitle () {
      return this.$t(`TRANSACTION.TYPE.${this.entityTypeLabel.toUpperCase()}_ENTITY_REGISTRATION`)
    },

    registrationTypesOptions () {
      const options = { ...this.allRegistrationTypesOptions }

      if (this.senderWallet && !this.senderWallet.isDelegate) {
        delete options[TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]
      }

      return options
    },

    allRegistrationTypesOptions () {
      return {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: this.$tc('ENTITY.TYPES.BUSINESS', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: this.$tc('ENTITY.TYPES.PRODUCT', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: this.$tc('ENTITY.TYPES.PLUGIN', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: this.$tc('ENTITY.TYPES.MODULE', 1),
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: this.$tc('ENTITY.TYPES.DELEGATE', 1)
      }
    },

    entityTypeLabel () {
      return this.allRegistrationTypesOptions[+this.step1.registrationType]
    },

    isStepValid () {
      if (this.step === 1) {
        return !this.$v.step1.$invalid
      }

      return !this.$refs.entity.$v.$invalid && !this.$v.$invalid
    },

    delegateUsername () {
      if (this.senderWallet && +this.step1.registrationType === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE) {
        const delegate = this.$store.getters['delegate/byAddress'](this.senderWallet.address)
        if (delegate) {
          return delegate.username
        }
      }
      return undefined
    },

    senderWallet () {
      if (this.step1.sender) {
        return this.$store.getters['wallet/byAddress'](this.step1.sender)
      }
      return undefined
    },

    currentWallet () {
      return this.senderWallet
    }
  },

  methods: {
    previousStep () {
      if (this.step === 2) {
        this.step = 1
        this.$set(this.form, 'passphrase', '')
        this.$set(this.form, 'secondPassphrase', '')
        this.$set(this.form, 'walletPassword', '')
      }
    },

    nextStep () {
      if (!this.isStepValid) {
        return
      }

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

    onEntityForm (value) {
      this.step2 = value
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

      const { entityName, ipfsData } = this.step2
      const entityType = +this.step1.registrationType

      // eslint-disable-next-line
      const sanitizedIpfsData = filter(ipfsData, (item) => !isEmpty(item))

      return {
        ...transactionData,
        asset: {
          type: entityType,
          // @TODO: let the user choose what sub-type they wish to use.
          subType: 0,
          action: +this.$options.entityAction,
          data: {
            name: entityName,
            ipfsData: await new File(new Request()).upload(sanitizedIpfsData)
          }
        }
      }
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildEntity(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.ENTITY_REGISTRATION', { entity: this.entityType }))
    },

    emitNext (transaction) {
      this.$emit('next', {
        transaction: {
          ...transaction,
          entityForm: this.step2
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
    },
    step1: {
      sender: {
        required
      },
      registrationType: {
        required
      }
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
