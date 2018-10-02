<template>
  <component
    :is="activeComponent"
    @next="emitBuilt"
  />
</template>

<script>
import TransactionFormDelegateRegistration from './TransactionFormDelegateRegistration'
import TransactionFormTransfer from './TransactionFormTransfer'
import TransactionFormVote from './TransactionFormVote'
import { find } from 'lodash'

export default {
  name: 'TransactionForm',

  components: {
    TransactionFormDelegateRegistration,
    TransactionFormTransfer,
    TransactionFormVote
  },

  props: {
    type: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    activeComponent: null
  }),

  // TODO: Fetch fees remotely
  mounted () {
    const component = find(this.$options.components, item => item.transactionType === this.type)

    if (!component) {
      throw new Error(`[TransactionForm] - Form for type ${this.type} not found.`)
    }

    this.activeComponent = component.name
  },

  methods: {
    emitBuilt (transaction) {
      this.$emit('built', transaction)
    }
  }
}
</script>
