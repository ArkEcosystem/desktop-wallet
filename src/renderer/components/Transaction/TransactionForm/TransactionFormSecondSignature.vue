<template>
  <form
    class="TransactionFormSecondSignature"
    @submit.prevent
  >
    <template v-if="!currentWallet.secondPublicKey">
      <Collapse
        :is-open="!isPassphraseStep"
        :animation-duration="{ enter: 0, leave: 0 }"
      >
        <PassphraseWords :passphrase-words="passphraseWords" />

        <button
          type="button"
          class="blue-button mt-5"
          @click="toggleStep"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </Collapse>

      <Collapse
        :is-open="isPassphraseStep"
      >
        <PassphraseVerification
          ref="passphraseVerification"
          :passphrase="passphraseWords"
          :word-positions="wordPositions"
          @verified="onVerification"
        />

        <div
          v-if="currentWallet.isLedger"
          class="mt-10"
        >
          {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
        </div>
        <InputPassword
          v-else-if="!currentWallet.passphrase"
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
          :pub-key-hash="session_network.version"
          class="mt-5"
        />

        <button
          type="button"
          class="blue-button mt-5 mr-4"
          @click="toggleStep"
        >
          {{ $t('COMMON.BACK') }}
        </button>

        <button
          :disabled="$v.form.$invalid || !isPassphraseVerified"
          type="button"
          class="blue-button mt-5"
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

      <portal
        v-if="!isPassphraseStep"
        to="transaction-footer"
      >
        <footer class="ModalWindow__container__footer--warning flex flex-row">

          <div class="flex w-80">{{ $t('WALLET_SECOND_SIGNATURE.INSTRUCTIONS') }}</div>
          <div class="flex flex-row justify-around ml-8">

            <ButtonReload
              :is-refreshing="isGenerating"
              :title="$t('WALLET_SECOND_SIGNATURE.NEW')"
              class="bg-theme-modal-footer-button mr-2"
              text-class="text-theme-modal-footer-button-text mt-1"
              @click="generateNewPassphrase"
            />

            <ButtonClipboard
              :value="secondPassphrase"
              class="flex py-2 px-4 rounded bg-theme-modal-footer-button text-theme-modal-footer-button-text"
            />
          </div>

        </footer>
      </portal>
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
import { InputPassword } from '@/components/Input'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput, PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionFormSecondSignature',

  transactionType: TRANSACTION_TYPES.SECOND_SIGNATURE,

  components: {
    ButtonClipboard,
    ButtonReload,
    Collapse,
    InputPassword,
    ModalLoader,
    PassphraseInput,
    PassphraseVerification,
    PassphraseWords
  },

  data: () => ({
    isGenerating: false,
    isPassphraseStep: false,
    isPassphraseVerified: false,
    secondPassphrase: '',
    form: {
      passphrase: '',
      walletPassword: null
    },
    showEncryptLoader: false,
    bip38Worker: null
  }),

  computed: {
    wordPositions () {
      return [3, 6, 9]
    },

    passphraseWords () {
      return this.secondPassphrase.split(' ')
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  watch: {
    isPassphraseStep () {
      this.$refs.passphraseVerification.focusFirst()
    }
  },

  created () {
    this.secondPassphrase = WalletService.generateSecondPassphrase(this.session_profile.bip39Language)
  },

  beforeDestroy () {
    this.bip38Worker.send('quit')
  },

  mounted () {
    if (this.bip38Worker) {
      this.bip38Worker.send('quit')
    }
    this.bip38Worker = this.$bgWorker.bip38()
    this.bip38Worker.on('message', message => {
      if (message.decodedWif === null) {
        this.$error(this.$t('ENCRYPTION.FAILED_DECRYPT'))
        this.showEncryptLoader = false
      } else if (message.decodedWif) {
        this.form.passphrase = null
        this.form.wif = message.decodedWif
        this.showEncryptLoader = false
        this.submit()
      }
    })
  },

  methods: {
    toggleStep () {
      this.isPassphraseStep = !this.isPassphraseStep
    },

    generateNewPassphrase () {
      this.isGenerating = true
      setTimeout(() => {
        this.secondPassphrase = WalletService.generateSecondPassphrase(this.session_profile.bip39Language)
        this.isGenerating = false
      }, 300)
    },

    onSubmit () {
      if (this.form.walletPassword && this.form.walletPassword.length) {
        this.showEncryptLoader = true
        this.bip38Worker.send({
          bip38key: this.currentWallet.passphrase,
          password: this.form.walletPassword,
          wif: this.session_network.wif
        })
      } else {
        this.submit()
      }
    },

    async submit () {
      const transactionData = {
        passphrase: this.form.passphrase,
        secondPassphrase: this.secondPassphrase,
        wif: this.form.wif
      }

      let success = true
      let transaction
      if (!this.currentWallet.isLedger) {
        transaction = await this.$client.buildSecondSignatureRegistration(transactionData)
      } else {
        success = false
        try {
          const transactionObject = await this.$client.buildSecondSignatureRegistration(transactionData, true)
          transaction = await TransactionService.ledgerSign(this.currentWallet, transactionObject, this)
          success = true
        } catch (error) {
          this.$error(`${this.$t('TRANSACTION.LEDGER_SIGN_FAILED')}: ${error.message}`)
        }
      }

      if (success) {
        this.emitNext(transaction)
        this.reset()
      }
    },

    onVerification () {
      this.isPassphraseVerified = true
    },

    reset () {
      this.isPassphraseStep = false
      this.isPassphraseVerified = false
      if (!this.currentWallet.passphrase) {
        this.$set(this.form, 'passphrase', '')
        this.$refs.passphrase.reset()
      } else {
        this.$set(this.form, 'walletPassword', '')
        this.$refs.password.reset()
      }
      this.$v.$reset()
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  },

  validations: {
    form: {
      passphrase: {
        isValid (value) {
          if (this.currentWallet.isLedger || this.currentWallet.passphrase) {
            return true
          }

          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }

          return false
        }
      },
      walletPassword: {
        isValid (value) {
          if (this.currentWallet.isLedger || !this.currentWallet.passphrase) {
            return true
          }

          if (!this.form.walletPassword || !this.form.walletPassword.length) {
            return false
          }

          if (this.$refs.password) {
            return !this.$refs.password.$v.$invalid
          }

          return false
        }
      }
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
</style>
