<template>
  <Component
    :is="activeComponent"
    v-bind="$attrs"
  />
</template>

<script>
import { TRANSACTION_TYPES, TRANSACTION_GROUPS } from '@config'
import { TransactionFormEntityRegistration, TransactionFormEntityResignation, TransactionFormEntityUpdate } from './TransactionFormEntity/index'

export default {
  name: 'TransactionFormEntity',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  transactionType: TRANSACTION_TYPES.GROUP_2.ENTITY,

  components: {
    TransactionFormEntityRegistration,
    TransactionFormEntityResignation,
    TransactionFormEntityUpdate
  },

  props: {
    entityAction: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    activeComponent: null
  }),

  mounted () {
    const component = Object.values(this.$options.components).find(component => {
      return component.entityAction === this.entityAction
    })

    if (!component) {
      throw new Error(`[TransactionFormEntity] - Form for action ${this.entityAction} not found.`)
    }

    this.activeComponent = component.name
  }
}
</script>
