<template>
  <form
    class="TransactionFormSecondSignature"
    @submit.prevent
  >
    <template v-if="!currentWallet.secondPublicKey">
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
      </ListDivided>

      <div
        v-if="!showPassphraseWords"
        class="flex content-center"
      >
        <ButtonReload
          :is-refreshing="isGenerating"
          :text="$t('WALLET_SECOND_SIGNATURE.NEW')"
          color-class="blue-button"
          class="px-8 py-4 mx-auto mt-5"
          @click="displayPassphraseWords"
        />
      </div>

      <Collapse
        :is-open="!isPassphraseStep"
        :animation-duration="{ enter: 0, leave: 0 }"
        class="TransactionFormSecondSignature__step-1"
      >
        <PassphraseWords
          v-show="showPassphraseWords"
          :passphrase-words="passphraseWords"
          class="TransactionFormSecondSignature__passphrase-words"
        />

        <button
          :disabled="isGenerating || !showPassphraseWords"
          :class="{ 'hidden': !showPassphraseWords }"
          type="button"
          class="TransactionFormSecondSignature__step-1__next blue-button mt-5"
          @click="toggleStep"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </Collapse>

      <Collapse
        :is-open="isPassphraseStep"
        class="TransactionFormSecondSignature__step-2"
      >
        <PassphraseVerification
          ref="passphraseVerification"
          :passphrase="passphraseWords"
          :word-positions="wordPositions"
          class="TransactionFormSecondSignature__passphrase-verification mb-10"
          @verified="onVerification"
        />

        <InputFee
          ref="fee"
          :currency="walletNetwork.token"
          :transaction-type="$options.transactionType"
          :show-insufficient-funds="true"
          class="TransactionFormSecondSignature__fee"
          @input="onFee"
        />

        <div v-if="!isMultiSignature">
          <div
            v-if="currentWallet.isLedger"
            class="TransactionFormSecondSignature__ledger-notice mt-10"
          >
            {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
          </div>

          <InputPassword
            v-else-if="currentWallet.passphrase"
            ref="password"
            v-model="$v.form.walletPassword.$model"
            :label="$t('TRANSACTION.PASSWORD')"
            :is-required="true"
            class="TransactionFormSecondSignature__password mt-4"
          />

          <PassphraseInput
            v-else
            ref="passphrase"
            v-model="$v.form.passphrase.$model"
            :address="currentWallet.address"
            :pub-key-hash="walletNetwork.version"
            class="TransactionFormSecondSignature__passphrase mt-4"
          />
        </div>

        <button
          type="button"
          class="TransactionFormSecondSignature__back blue-button mt-5 mr-4"
          @click="toggleStep"
        >
          {{ $t('COMMON.BACK') }}
        </button>

        <button
          :disabled="$v.form.$invalid || !isPassphraseVerified"
          type="button"
          class="TransactionFormSecondSignature__step-2__next blue-button mt-5"
          @click="onSubmit"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </Collapse>

      <ModalLoader
        ref="modalLoader"
        :message="$t('ENCRYPTION.DECRYPTING')"
        :visible="showEncryptLoader"
      />
      <ModalLoader
        :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
        :visible="showLedgerLoader"
      />

      <Portal
        v-if="!isPassphraseStep && showPassphraseWords"
        to="transaction-footer"
      >
        <footer class="TransactionFormSecondSignature__footer ModalWindow__container__footer--warning">
          <div class="flex w-80">
            {{ $t('WALLET_SECOND_SIGNATURE.INSTRUCTIONS') }}
          </div>
          <div class="flex flex-row justify-around ml-8">
            <ButtonReload
              :is-refreshing="isGenerating"
              :title="$t('WALLET_SECOND_SIGNATURE.NEW')"
              class="bg-theme-modal-footer-button mr-2"
              text-class="text-theme-modal-footer-button-text"
              @click="generateNewPassphrase"
            />

            <ButtonClipboard
              :value="secondPassphrase"
              class="flex py-2 px-4 rounded bg-theme-modal-footer-button text-theme-modal-footer-button-text"
            />
          </div>
        </footer>
      </Portal>
    </template>
    <template v-else>
      {{ $t('WALLET_SECOND_SIGNATURE.ALREADY_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ButtonClipboard, ButtonReload } from '@/components/Button'
import { Collapse } from '@/components/Collapse'
import { InputFee, InputPassword } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput, PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import WalletService from '@/services/wallet'
import mixin from './mixin'

export default {
  name: 'TransactionFormSecondSignature',

  transactionType: TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE,

  components: {
    ButtonClipboard,
    ButtonReload,
    Collapse,
    InputFee,
    InputPassword,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput,
    PassphraseVerification,
    PassphraseWords
  },

  mixins: [mixin],

  data: () => ({
    isGenerating: false,
    isPassphraseStep: false,
    isPassphraseVerified: false,
    secondPassphrase: '',
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: ''
    },
    showPassphraseWords: false
  }),

  computed: {
    // TODO: doesn't need to be computed
    wordPositions () {
      return [3, 6, 9]
    },

    passphraseWords () {
      // Check for Japanese "space"
      if (/\u3000/.test(this.secondPassphrase)) {
        return this.secondPassphrase.split('\u3000')
      }

      return this.secondPassphrase.split(' ')
    }
  },

  watch: {
    isPassphraseStep () {
      if (this.isPassphraseStep) {
        this.$refs.passphraseVerification.focusFirst()
      }
    }
  },

  created () {
    this.secondPassphrase = WalletService.generateSecondPassphrase(this.session_profile.bip39Language)
  },

  methods: {
    getTransactionData () {
      return {
        address: this.currentWallet.address,
        passphrase: this.form.passphrase,
        secondPassphrase: this.secondPassphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildSecondSignatureRegistration(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.SECOND_SIGNATURE'))
    },

    postSubmit () {
      this.reset()

      // The current passphrase has been already verified
      this.isPassphraseVerified = true
    },

    toggleStep () {
      this.isPassphraseStep = !this.isPassphraseStep
    },

    // TODO: must be a better way of doing this without a timeout?
    displayPassphraseWords () {
      this.isGenerating = true
      setTimeout(() => {
        this.isGenerating = false
        this.showPassphraseWords = true
      }, 300)
    },

    // TODO: must be a better way of doing this without a timeout?
    generateNewPassphrase () {
      this.reset()
      this.isGenerating = true
      setTimeout(() => {
        this.secondPassphrase = WalletService.generateSecondPassphrase(this.session_profile.bip39Language)
        this.isGenerating = false
      }, 300)
    },

    onVerification () {
      this.isPassphraseVerified = true
    },

    reset () {
      this.isPassphraseStep = false
      this.isPassphraseVerified = false
      if (!this.isMultiSignature) {
        if (!this.currentWallet.passphrase && !this.currentWallet.isLedger) {
          this.$set(this.form, 'passphrase', '')
          this.$refs.passphrase.reset()
        } else if (!this.currentWallet.isLedger) {
          this.$set(this.form, 'walletPassword', '')
          this.$refs.password.reset()
        }
      }
      this.$v.$reset()
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword
    }
  }
}
</script>

<style scoped>
.TransactionFormSecondSignature {
  min-width: 25em;
}

.TransactionFormSecondSignature /deep/ .Collapse__handler {
  display: none
}

.TransactionFormSecondSignature__footer {
  @apply .flex .flex-row .justify-between;
}
</style>
