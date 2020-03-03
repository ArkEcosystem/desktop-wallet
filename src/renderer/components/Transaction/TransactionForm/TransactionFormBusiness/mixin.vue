<template>
  <form
    class="TransactionFormBusiness flex flex-col"
    @submit.prevent
  >
    <template>
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
      </ListDivided>

      <InputText
        v-model="$v.form.asset.name.$model"
        :helper-text="nameError"
        :label="nameLabel"
        :is-invalid="!!nameError"
        class="TransactionFormBusiness__name mb-5"
        name="name"
      />

      <InputText
        v-model="$v.form.asset.website.$model"
        :helper-text="websiteError"
        :label="$t('WALLET_BUSINESS.WEBSITE')"
        :is-invalid="!!websiteError"
        class="TransactionFormBusiness__website mb-5"
        name="website"
      />

      <InputText
        v-model="$v.form.asset.vat.$model"
        :helper-text="vatError"
        :label="vatLabel"
        :is-invalid="!!vatError"
        class="TransactionFormBusiness__vat mb-5"
        name="vat"
      />

      <InputText
        v-model="$v.form.asset.repository.$model"
        :helper-text="repositoryError"
        :label="repositoryLabel"
        :is-invalid="!!repositoryError"
        class="TransactionFormBusiness__repository mb-5"
        name="repository"
      />

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-group="$options.transactionGroup"
        :transaction-type="$options.transactionType"
        :show-insufficient-funds="true"
        class="TransactionFormBusiness__fee"
        @input="onFee"
      />

      <div v-if="!isMultiSignature">
        <div
          v-if="currentWallet.isLedger"
          class="TransactionFormBusiness__ledger-notice mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>

        <InputPassword
          v-else-if="currentWallet.passphrase"
          ref="password"
          v-model="$v.form.walletPassword.$model"
          :label="$t('TRANSACTION.PASSWORD')"
          :is-required="true"
          class="TransactionFormBusiness__password mt-4"
        />

        <PassphraseInput
          v-else
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="walletNetwork.version"
          class="TransactionFormBusiness__passphrase mt-4"
        />
      </div>

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormBusiness__second-passphrase mt-5"
      />

      <button
        :disabled="!isFormValid"
        class="TransactionFormBusiness__next blue-button mt-10 ml-0"
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

<script type="text/javascript">
import { maxLength, minLength, required, url } from 'vuelidate/lib/validators'
import { InputFee, InputPassword, InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import mixin from '@/components/Transaction/TransactionForm/mixin'

const maxNameLength = 40
const minVatLength = 8
const maxVatLength = 15
const minRepositoryLength = 12

export default {
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
      passphrase: '',
      walletPassword: '',
      asset: {
        name: '',
        website: '',
        vat: '',
        repository: ''
      }
    }
  }),

  computed: {
    business () {
      return this.wallet_fromRoute.business
    },

    isUpdate () {
      return !!this.business
    },

    hasSameName () {
      return this.form.asset.name === this.business.name
    },

    hasSameWebsite () {
      return this.form.asset.website === this.business.website
    },

    hasSameVat () {
      return (
        this.form.asset.vat === this.business.vat ||
        (!this.form.asset.vat && (this.business.vat === undefined))
      )
    },

    hasSameRepository () {
      return (
        this.form.asset.repository === this.business.repository ||
        (!this.form.asset.repository && (this.business.repository === undefined))
      )
    },

    nameLabel () {
      return `${this.$t('WALLET_BUSINESS.NAME')} - ${this.$t('VALIDATION.MAX_LENGTH', [maxNameLength])}`
    },

    isFormValid () {
      if (this.isUpdate) {
        return !this.$v.form.$invalid && !(
          this.hasSameName &&
          this.hasSameWebsite &&
          this.hasSameVat &&
          this.hasSameRepository
        )
      }

      return !this.$v.form.$invalid
    },

    nameError () {
      if (this.$v.form.asset.name.$dirty && this.$v.form.asset.name.$invalid) {
        if (!this.$v.form.asset.name.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('WALLET_BUSINESS.NAME')])
        } else if (!this.$v.form.asset.name.tooLong) {
          return this.$t('VALIDATION.TOO_LONG', [this.$t('WALLET_BUSINESS.NAME')])
        } else if (!this.$v.form.asset.name.validName) {
          return this.$t('VALIDATION.NOT_VALID', [this.$t('WALLET_BUSINESS.NAME')])
        }
      }

      return null
    },

    websiteError () {
      if (this.$v.form.asset.website.$dirty && this.$v.form.asset.website.$invalid) {
        if (!this.$v.form.asset.website.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('WALLET_BUSINESS.WEBSITE')])
        } else if (!this.$v.form.asset.website.url) {
          return this.$t('VALIDATION.INVALID_URL')
        }
      }

      return null
    },

    vatLabel () {
      return `${this.$t('WALLET_BUSINESS.VAT')} - ${this.$t('VALIDATION.MIN_LENGTH', [minVatLength])} ${this.$t('VALIDATION.MAX_LENGTH', [maxVatLength])}`
    },

    vatError () {
      if (this.$v.form.asset.vat.$dirty && this.$v.form.asset.vat.$invalid) {
        if (!this.$v.form.asset.vat.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('WALLET_BUSINESS.VAT')])
        } else if (!this.$v.form.asset.vat.tooShort) {
          return this.$t('VALIDATION.TOO_SHORT', [this.$t('WALLET_BUSINESS.VAT')])
        } else if (!this.$v.form.asset.vat.tooLong) {
          return this.$t('VALIDATION.TOO_LONG', [this.$t('WALLET_BUSINESS.VAT')])
        }
      }

      return null
    },

    repositoryLabel () {
      return `${this.$t('WALLET_BUSINESS.REPOSITORY')} - ${this.$t('VALIDATION.MIN_LENGTH', [minRepositoryLength])}`
    },

    repositoryError () {
      if (this.$v.form.asset.repository.$dirty && this.$v.form.asset.repository.$invalid) {
        if (!this.$v.form.asset.repository.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('WALLET_BUSINESS.REPOSITORY')])
        } else if (!this.$v.form.asset.repository.url) {
          return this.$t('VALIDATION.INVALID_URL')
        } else if (!this.$v.form.asset.repository.tooShort) {
          return this.$t('VALIDATION.TOO_SHORT', [this.$t('WALLET_BUSINESS.REPOSITORY')])
        }
      }

      return null
    }
  },

  methods: {
    getTransactionData () {
      const businessAsset = Object.assign({}, this.form.asset)

      for (const property of Object.keys(this.form.asset)) {
        if (
          (this.isUpdate && this[`hasSame${this.strings_capitalizeFirst(property)}`]) ||
          !businessAsset[property].length
        ) {
          delete businessAsset[property]
        }
      }

      const transactionData = {
        address: this.currentWallet.address,
        asset: businessAsset,
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
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase,

      asset: {
        name: {
          required,
          tooLong: maxLength(maxNameLength),
          validName: value => {
            return /^[a-zA-Z0-9]+(( - |[ ._-])[a-zA-Z0-9]+)*[.]?$/.test(value)
          }
        },

        website: {
          required,
          url
        },

        vat: {
          required (value) {
            return (this.business && this.business.vat) ? required(value) : true
          },
          tooShort: minLength(minVatLength),
          tooLong: maxLength(maxVatLength)
        },

        repository: {
          required (value) {
            return (this.business && this.business.repository) ? required(value) : true
          },
          tooShort: minLength(minRepositoryLength),
          url
        }
      }
    }
  }
}
</script>
