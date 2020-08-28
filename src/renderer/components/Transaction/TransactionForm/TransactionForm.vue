<template>
  <Component
    :is="activeComponent"
    v-bind="$attrs"
    @cancel="emitCancel"
    @next="emitBuilt"
  />
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { TRANSACTION_GROUPS } from '@config'
import TransactionFormDelegateRegistration from './TransactionFormDelegateRegistration'
import TransactionFormDelegateResignation from './TransactionFormDelegateResignation'
import TransactionFormIpfs from './TransactionFormIpfs'
import TransactionFormMultiSign from './TransactionFormMultiSign'
import TransactionFormMultiSignature from './TransactionFormMultiSignature'
import TransactionFormTransfer from './TransactionFormTransfer'
import TransactionFormVote from './TransactionFormVote'
import TransactionFormSecondSignature from './TransactionFormSecondSignature'

export default {
  name: 'TransactionForm',

  components: {
    TransactionFormDelegateRegistration,
    TransactionFormDelegateResignation,
    TransactionFormIpfs,
    TransactionFormMultiSign,
    TransactionFormMultiSignature,
    TransactionFormTransfer,
    TransactionFormVote,
    TransactionFormSecondSignature
  },

  props: {
    group: {
      type: Number,
      required: false,
      default: TRANSACTION_GROUPS.STANDARD
    },

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
    const group = this.type === -1 ? TRANSACTION_GROUPS.STANDARD : this.group
    const component = Object.values(this.$options.components).find(component => {
      if ((component.transactionGroup || TRANSACTION_GROUPS.STANDARD) !== group) {
        return false
      }

      return component.transactionType === this.type
    })

    if (!component) {
      throw new Error(`[TransactionForm] - Form for type ${this.type} (group ${group}) not found.`)
    }

    this.activeComponent = component.name
  },

  methods: {
    emitBuilt (transaction) {
      this.$emit('built', transaction)
    },

    emitCancel (reason) {
      this.$emit('cancel', reason)
    }
  }
}
</script>
