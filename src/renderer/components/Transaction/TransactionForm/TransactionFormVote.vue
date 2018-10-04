<template>
  <form
    class="TransactionFormVote"
    @submit.prevent="void 0"
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
          :value="delegate.production.productivity"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.RANK')"
          :value="delegate.rank"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.APPROVAL')"
          :value="delegate.production.approval"
        />
        <!-- TODO: get forged -->
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.FORGED')"
          :value="delegate.blocks.produced"
        />
        <ListDividedItem
          :label="$t('WALLET_DELEGATES.BLOCKS')"
          :value="delegate.blocks.produced"
        />
        <ListDividedItem
          v-if="delegate.votes"
          :label="$t('WALLET_DELEGATES.VOTERS')"
          :value="delegate.votes"
        />
      </ListDivided>

      <button
        type="button"
        class="blue-button mt-5"
        @click="toggleStep"
      >
        {{ $t('WALLET_DELEGATES.VOTE') }}
      </button>
    </Collapse>

    <Collapse
      :is-open="isPassphraseStep"
    >
      <PassphraseInput
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :pub-key-hash="currentNetwork.version"
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
  </form>
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
    }
  },

  data: () => ({
    isPassphraseStep: false,
    form: {
      passphrase: ''
    }
  }),

  computed: {
    currentNetwork () {
      return this.$store.getters['session/currentNetwork']
    }
  },

  watch: {
    isPassphraseStep () {
      this.$refs.passphrase.focus()
    }
  },

  methods: {
    toggleStep () {
      this.isPassphraseStep = !this.isPassphraseStep
    },

    async onSubmit () {
      const { publicKey } = this.delegate
      // TODO: Handle unvote
      const votes = [
        `+${publicKey}`
      ]
      const transaction = await this.$client.buildVote({
        passphrase: this.form.passphrase,
        votes
      })

      this.emitNext(transaction)
      this.reset()
    },

    reset () {
      this.isPassphraseStep = false
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
.TransactionFormVote {
  min-width: 25em;
}

.TransactionFormVote >>> .Collapse__handler {
  display: none
}
</style>
