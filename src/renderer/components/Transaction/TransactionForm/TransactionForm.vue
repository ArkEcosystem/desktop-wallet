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
import TransactionFormMultiPayment from './TransactionFormMultiPayment'
import TransactionFormMultiSign from './TransactionFormMultiSign'
import TransactionFormMultiSignature from './TransactionFormMultiSignature'
import TransactionFormTransfer from './TransactionFormTransfer'
import TransactionFormVote from './TransactionFormVote'
import TransactionFormSecondSignature from './TransactionFormSecondSignature'
import TransactionFormBusiness from './TransactionFormBusiness'
import TransactionFormBridgechain from './TransactionFormBridgechain'
import { find } from 'lodash'

export default {
  name: 'TransactionForm',

  components: {
    TransactionFormDelegateRegistration,
    TransactionFormDelegateResignation,
    TransactionFormIpfs,
    TransactionFormMultiPayment,
    TransactionFormMultiSign,
    TransactionFormMultiSignature,
    TransactionFormTransfer,
    TransactionFormVote,
    TransactionFormSecondSignature,
    ...TransactionFormBusiness,
    ...TransactionFormBridgechain
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
    const component = find(this.$options.components, component => {
      const group = component.transactionGroup || TRANSACTION_GROUPS.STANDARD
      if (group !== this.group) {
        return false
      }

      return component.transactionType === this.type
    })

    if (!component) {
      throw new Error(`[TransactionForm] - Form for type ${this.type} (group ${this.group}) not found.`)
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
