<template>
  <Component
    :is="activeComponent"
    v-bind="$attrs"
  />
</template>

<script>
import { TRANSACTION_TYPES, TRANSACTION_GROUPS } from '@config'
import { TransactionConfirmEntityRegistration } from './TransactionConfirmEntity/index'

export default {
  name: 'TransactionConfirmEntity',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  transactionType: TRANSACTION_TYPES.GROUP_2.ENTITY,

  components: {
    TransactionConfirmEntityRegistration
  },

  inject: ['currentWallet', 'transaction'],

  data: () => ({
    activeComponent: null
  }),

  mounted () {
    const entityAction = this.transaction.asset.action
    const component = Object.values(this.$options.components).find(component => {
      return component.entityAction === entityAction
    })

    if (!component) {
      throw new Error(`[TransactionConfirmEntity] - Confirmation for action ${entityAction} not found.`)
    }

    this.activeComponent = component.name
  }
}
</script>
