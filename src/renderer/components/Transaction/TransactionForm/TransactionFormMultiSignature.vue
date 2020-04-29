<template>
  <form
    class="TransactionFormMultiSignature flex flex-col"
    @submit.prevent
  >
    <ListDivided
      v-if="senderLabel"
      :is-floating-label="true"
    >
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
    </ListDivided>

    <div
      v-if="step === 1"
      class="TransactionFormMultiSignature__step-1"
    >
      <MenuTab
        ref="menutab"
        v-model="currentTab"
        class="TransactionModalMultiSignature__menu-tabs"
      >
        <MenuTabItem
          v-for="(tab, id) in tabs"
          :key="id"
          :tab="id"
          :label="tab.text"
          class="TransactionFormMultiSignature__menu-tab flex-1"
        />
      </MenuTab>

      <div class="flex flex-row">
        <div
          v-if="addressTab"
          class="TransactionFormMultiSignature__address-tab flex-1"
        >
          <InputAddress
            ref="address"
            v-model="$v.address.$model"
            :label="$t('COMMON.ADDRESS')"
            :pub-key-hash="walletNetwork.version"
            :show-suggestions="true"
            :is-disabled="!currentWallet"
            :is-required="false"
            :is-invalid="!!addressWarning"
            :helper-text="addressWarning"
            name="address"
            class="TransactionFormMultiSignature__address"
          />
        </div>

        <div
          v-else-if="publicKeyTab"
          class="flex-1"
        >
          <InputPublicKey
            ref="publicKey"
            v-model="$v.publicKey.$model"
            :is-required="false"
            :warning-text="publicKeyWarning"
            class="TransactionFormMultiSignature__public-key"
          />
        </div>

        <ButtonGeneric
          :disabled="!validStep1"
          :label="$t('TRANSACTION.MULTI_SIGNATURE.BUTTON_ADD')"
          class="TransactionFormMultiSignature__add py-1 flex-inline h-8 mt-4 ml-4"
          @click="addPublicKey"
        />
      </div>

      <TransactionMultiSignatureList
        :items="$v.form.publicKeys.$model"
        :show-count="true"
        class="TransactionModalMultiSignature__public-keys mt-4"
        @remove="emitRemovePublicKey"
      />
    </div>

    <div v-if="step === 2">
      <InputText
        ref="minKeys"
        v-model="$v.form.minKeys.$model"
        :label="$t('TRANSACTION.MULTI_SIGNATURE.MIN_KEYS')"
        :helper-text="minKeysError"
        :is-invalid="!!minKeysError"
        name="minKeys"
        type="number"
        class="TransactionFormMultiSignature__min-keys mb-5"
      />

      <InputFee
        ref="fee"
        :currency="walletNetwork.token"
        :transaction-type="$options.transactionType"
        :is-disabled="!currentWallet"
        :wallet="currentWallet"
        :wallet-network="walletNetwork"
        class="TransactionFormMultiSignature__fee"
        @input="onFee"
      />

      <div
        v-if="currentWallet.isLedger"
        class="TransactionFormMultiSignature__ledger-notice mt-10"
      >
        {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
      </div>

      <InputPassword
        v-else-if="currentWallet.passphrase"
        ref="password"
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
        class="TransactionFormMultiSignature__password mt-4"
      />

      <PassphraseInput
        v-else
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="currentWallet.address"
        :pub-key-hash="walletNetwork.version"
        :is-disabled="!currentWallet"
        class="TransactionFormMultiSignature__passphrase mt-4"
      />

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="currentWallet.secondPublicKey"
        class="TransactionFormMultiSignature__second-passphrase mt-5"
      />
    </div>

    <footer class="mt-4 flex justify-between items-center">
      <div class="self-start">
        <button
          :disabled="step === 1"
          class="TransactionFormMultiSignature__prev blue-button"
          @click="previousStep"
        >
          {{ $t('COMMON.PREV') }}
        </button>

        <button
          :disabled="!isFormValid"
          class="TransactionFormMultiSignature__next blue-button"
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
import { TRANSACTION_TYPES } from '@config'
import { ButtonGeneric } from '@/components/Button'
import { InputAddress, InputFee, InputPublicKey, InputPassword, InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { MenuTab, MenuTabItem } from '@/components/Menu'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionMultiSignatureList from '@/components/Transaction/TransactionMultiSignatureList'
import mixin from './mixin'

export default {
  name: 'TransactionFormMultiSignature',

  transactionType: TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE,

  components: {
    ButtonGeneric,
    InputAddress,
    InputFee,
    InputPassword,
    InputPublicKey,
    InputText,
    ListDivided,
    ListDividedItem,
    MenuTab,
    MenuTabItem,
    ModalLoader,
    PassphraseInput,
    TransactionMultiSignatureList
  },

  mixins: [mixin],

  data: () => ({
    step: 1,
    currentTab: 0,
    address: '',
    publicKey: '',
    form: {
      publicKeys: [],
      minKeys: null,
      fee: 0,
      passphrase: '',
      walletPassword: ''
    }
  }),

  computed: {
    addressTab () {
      return this.currentTab === 0
    },

    publicKeyTab () {
      return this.currentTab === 1
    },

    tabs () {
      return [
        {
          text: this.$t('TRANSACTION.MULTI_SIGNATURE.TAB.ADDRESS')
        },
        {
          text: this.$t('TRANSACTION.MULTI_SIGNATURE.TAB.PUBLIC_KEY')
        }
      ]
    },

    validStep1 () {
      if (this.addressTab) {
        if (!this.$v.address.$dirty || this.$v.address.$invalid ||
          this.addressWarning || this.address.replace(/\s+/, '') === '') {
          return false
        }
      } else {
        if (!this.$v.publicKey.$dirty || this.$v.publicKey.$invalid ||
          this.publicKeyWarning || this.publicKey.replace(/\s+/, '') === '') {
          return false
        }
      }

      return true
    },

    isFormValid () {
      if (this.step === 1) {
        return !this.$v.form.publicKeys.$invalid
      }

      return !this.$v.form.$invalid
    },

    addressWarning () {
      if (!this.$v.address.$dirty) {
        return null
      }

      if (this.form.publicKeys.some(key => key.address === this.$v.address.$model)) {
        return this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE')
      }

      return null
    },

    publicKeyWarning () {
      if (!this.$v.publicKey.$dirty) {
        return null
      }

      if (this.form.publicKeys.some(key => key.publicKey === this.$v.publicKey.$model)) {
        return this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE')
      }

      return null
    },

    maximumPublicKeys () {
      if (!this.session_network.constants || !this.session_network.constants.maxMultiSignatureParticipants) {
        return 16
      }

      return this.session_network.constants.maxMultiSignatureParticipants
    },

    minKeysError () {
      if (this.$v.form.minKeys.$dirty && this.$v.form.minKeys.$error) {
        if (!this.$v.form.minKeys.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.MULTI_SIGNATURE.MIN_KEYS')])
        } else if (!this.$v.form.minKeys.belowMaximum) {
          return this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_HIGH')
        } else if (!this.$v.form.minKeys.aboveMinimum) {
          return this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_LOW')
        }
      }

      return null
    }
  },

  mounted () {
    this.form.publicKeys.push({
      address: this.currentWallet.address,
      publicKey: this.currentWallet.publicKey
    })
    this.updateMinKeys()
  },

  methods: {
    getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        publicKeys: this.form.publicKeys.map(key => key.publicKey),
        minKeys: this.form.minKeys,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      return transactionData
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      const transaction = await this.$client.buildMultiSignature(transactionData, isAdvancedFee, returnObject)
      if (!returnObject) {
        transaction.multiSignature = transaction.asset.multiSignature
      }

      return transaction
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.MULTI_SIGNATURE'))
    },

    async addPublicKey () {
      const entry = {
        address: null,
        publicKey: null
      }
      if (this.addressTab) {
        entry.address = this.address

        let wallet = this.$store.getters['wallet/byAddress'](this.address)
        if (wallet && wallet.publicKey) {
          entry.publicKey = wallet.publicKey
        } else {
          wallet = await this.$client.fetchWallet(this.address)

          if (wallet && wallet.publicKey) {
            entry.publicKey = wallet.publicKey
          } else {
            this.$error(this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_NOT_FOUND'))

            return
          }
        }

        this.$refs.address.reset()
      } else {
        entry.publicKey = this.publicKey

        this.$refs.publicKey.reset()
      }

      const existingEntry = this.form.publicKeys.find(key => key.publicKey === entry.publicKey)
      if (existingEntry) {
        if (entry.address && !existingEntry.address) {
          existingEntry.address = entry.address
        }

        this.$error(this.$t('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS'))

        return
      }

      this.form.publicKeys.push(entry)
      this.updateMinKeys()
    },

    updateMinKeys () {
      this.$v.form.minKeys.$model = this.form.publicKeys.length
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

    emitRemovePublicKey (index) {
      this.$v.form.publicKeys.$model = [
        ...this.form.publicKeys.slice(0, index),
        ...this.form.publicKeys.slice(index + 1)
      ]
    }
  },

  validations: {
    publicKey: {
      isValid () {
        if (this.$refs.publicKey) {
          return !this.$refs.publicKey.$v.$invalid
        }

        return false
      }
    },

    address: {
      isValid () {
        if (this.$refs.address) {
          return !this.$refs.address.$v.$invalid
        }

        return false
      }
    },

    form: {
      publicKeys: {
        notEmpty () {
          return !!this.form.publicKeys.length
        },

        aboveMinimum () {
          return this.form.publicKeys.length > 1
        },

        belowMaximum () {
          return this.form.publicKeys.length < this.maximumPublicKeys
        }
      },

      minKeys: {
        required,

        belowMaximum (value) {
          return value <= this.form.publicKeys.length
        },

        aboveMinimum (value) {
          return value >= 1
        }
      },

      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      secondPassphrase: mixin.validators.secondPassphrase,
      walletPassword: mixin.validators.walletPassword
    }
  }
}
</script>

<style>
.TransactionModalMultiSignature__menu-tabs .MenuTab__nav {
  @apply .rounded-lg;
}

.TransactionModalMultiSignature__menu-tabs .MenuTab__nav__items {
  @apply .flex;
}

.TransactionModalMultiSignature__menu-tabs .MenuTab__nav__item {
  @apply .flex-1;
}

.TransactionModalMultiSignature__menu-tabs .MenuTab__nav__item:first-child {
  @apply .rounded-l;
}
.TransactionModalMultiSignature__menu-tabs .MenuTab__nav__item:last-child {
  @apply .rounded-r;
}

.TransactionModalMultiSignature__menu-tabs .MenuTab__content {
  @apply .hidden;
}
</style>
