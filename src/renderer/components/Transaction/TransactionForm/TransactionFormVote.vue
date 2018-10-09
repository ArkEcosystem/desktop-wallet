<template>
  <div
    class="TransactionFormVote"
  >
    <Collapse
      :is-open="!isPassphraseStep"
    >
      <ListDivided>
        <ListDividedItem
          :label="$t('INPUT_ADDRESS.LABEL')"
          :value="delegate.address"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.PRODUCTIVITY')"
          :value="formatPercentage(delegate.production.productivity)"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.RANK')"
          :value="delegate.rank"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.APPROVAL')"
          :value="formatPercentage(delegate.production.approval)"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.FORGED')"
          :value="forged"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.BLOCKS')"
          :value="delegate.blocks.produced"
        />
        <ListDividedItem
          v-if="delegate.votes"
          :label="$t('WALLET_DELEGATES.VOTES')"
          :value="formatVotes(delegate.votes)"
        />
      </ListDivided>

      <button
        v-show="currentWallet.isSendingEnabled"
        type="button"
        class="blue-button mt-5"
        @click="toggleStep"
      >
        {{ isVoter ? $t('WALLET_DELEGATES.UNVOTE') : $t('WALLET_DELEGATES.VOTE') }}
      </button>
    </Collapse>

    <Collapse
      :is-open="isPassphraseStep"
    >
      <PassphraseInput
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="currentWallet.address"
        :pub-key-hash="session_network.version"
        class="mt-5"
      />

      <PassphraseInput
        v-if="currentWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="session_network.version"
        class="mt-5"
      />

      <button
        :disabled="$v.form.$invalid"
        type="button"
        class="blue-button mt-5"
        @click="onSubmit"
      >
        {{ $t('COMMON.NEXT') }}
      </button>
    </Collapse>
  </div>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { Collapse } from '@/components/Collapse'
import { PassphraseInput } from '@/components/Passphrase'

export default {
  name: 'TransactionFormVote',

  transactionType: TRANSACTION_TYPES.VOTE,

  validations: {
    form: {
      passphrase: {
        isValid (value) {
          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }
          return false
        }
      },
      secondPassphrase: {
        isValid (value) {
          if (!this.currentWallet.secondPublicKey) {
            return true
          }

          if (this.$refs.secondPassphrase) {
            return !this.$refs.secondPassphrase.$v.$invalid
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
    PassphraseInput
  },

  props: {
    delegate: {
      type: Object,
      required: true
    },
    isVoter: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isPassphraseStep: false,
    form: {
      passphrase: ''
    },
    forged: 0
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
    this.fetchForged()
  },

  methods: {
    toggleStep () {
      this.isPassphraseStep = !this.isPassphraseStep
    },

    formatPercentage (productivity) {
      return `${this.$n(productivity, { minimumFractionDigits: 2 })}%`
    },

    formatVotes (votes) {
      return this.$n(parseFloat(this.currency_subToUnit(votes)), { maximumFractionDigits: 2 })
    },

    async fetchForged () {
      const forged = await this.$client.fetchDelegateForged(this.delegate)
      this.forged = this.currency_format(this.currency_subToUnit(forged), { currencyFrom: 'network' })
    },

    async onSubmit () {
      const { publicKey } = this.delegate
      const prefix = this.isVoter ? '-' : '+'

      const votes = [
        `${prefix}${publicKey}`
      ]
      let transactionData = {
        passphrase: this.form.passphrase,
        votes
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData['secondPassphrase'] = this.form.secondPassphrase
      }

      const transaction = await this.$client.buildVote(transactionData)
      this.emitNext(transaction)
      this.reset()
    },

    reset () {
      this.isPassphraseStep = false
      this.$set(this.form, 'passphrase', '')
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
.TransactionFormVote {
  min-width: 25em;
}

.TransactionFormVote >>> .Collapse__handler {
  display: none
}
</style>
