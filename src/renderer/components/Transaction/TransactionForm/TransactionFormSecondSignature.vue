<template>
  <form
    class="TransactionFormSecondSignature"
    @submit.prevent="void 0"
  >
    <template v-if="!currentWallet.secondPublicKey">
      <Collapse
        :is-open="!isPassphraseStep"
      >
        <PassphraseWords :passphrase-words="secondPassphrase.split(' ')" />

        <button
          type="button"
          class="blue-button mt-5"
          @click="toggleStep"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
        <button
          type="button"
          class="blue-button mt-5"
          @click="generateNewPassphrase"
        >
          {{ $t('WALLET_SECOND_SIGNATURE.NEW') }}
        </button>
      </Collapse>

      <Collapse
        :is-open="isPassphraseStep"
      >
        <PassphraseVerification
          :passphrase="secondPassphrase.split(' ')"
          :word-positions="[3, 6, 9]"
          @verified="onVerification"
        />

        <PassphraseInput
          ref="passphrase"
          v-model="$v.form.passphrase.$model"
          :address="currentWallet.address"
          :pub-key-hash="session_network.version"
          class="mt-5"
        />

        <button
          :disabled="$v.form.$invalid || !isPassphraseVerified"
          type="button"
          class="blue-button mt-5"
          @click="onSubmit"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </Collapse>
    </template>
    <template v-else>
      {{ $t('WALLET_SECOND_SIGNATURE.ALREADY_REGISTERED') }}
    </template>
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { Collapse } from '@/components/Collapse'
import { PassphraseInput, PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionFormSecondSignature',

  transactionType: TRANSACTION_TYPES.SECOND_SIGNATURE,

  validations: {
    form: {
      passphrase: {
        isValid (value) {
          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }
          return false
        }
      }
    }
  },

  components: {
    ListDivided,
    ListDividedItem,
    Collapse,
    PassphraseInput,
    PassphraseVerification,
    PassphraseWords
  },

  data: () => ({
    isPassphraseStep: false,
    isPassphraseVerified: false,
    secondPassphrase: '',
    form: {
      passphrase: ''
    }
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  watch: {
    isPassphraseStep () {
      this.$refs.passphrase.focus()
    }
  },

  mounted () {
    this.secondPassphrase = WalletService.generateSecondPassphrase()
    console.log(this.secondPassphrase)
  },

  methods: {
    toggleStep () {
      this.isPassphraseStep = !this.isPassphraseStep
    },

    generateNewPassphrase () {
      this.secondPassphrase = WalletService.generateSecondPassphrase()
      console.log(this.secondPassphrase)
    },

    async onSubmit () {
      const transaction = await this.$client.buildSecondSignatureRegistration({
        passphrase: this.form.passphrase,
        secondPassphrase: this.secondPassphrase
      })

      this.emitNext(transaction)
      this.reset()
    },

    onVerification () {
      this.isPassphraseVerified = true
    },

    reset () {
      this.isPassphraseStep = false
      this.isPassphraseVerified = false
      this.form.passphrase = ''
      this.$refs.passphrase.reset()
      this.$v.$reset()
    },

    emitNext (transaction) {
      this.$emit('next', transaction)
    }
  }
}
</script>

<style scoped>
.TransactionFormSecondSignature {
  min-width: 25em;
}

.TransactionFormSecondSignature >>> .Collapse__handler {
  display: none
}
</style>
