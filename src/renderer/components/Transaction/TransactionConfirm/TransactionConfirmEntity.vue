<template>
  <Component
    :is="activeComponent"
    :current-wallet="currentWallet"
    :transaction="transaction"
    :extra="extra"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { TRANSACTION_TYPES, TRANSACTION_GROUPS } from '@config'
import * as entityConfirmationComponents from './Entity'

export default {
  name: 'TransactionConfirmEntity',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  transactionType: TRANSACTION_TYPES.GROUP_2.ENTITY,

  components: {
    ...entityConfirmationComponents
  },

  inject: ['currentWallet', 'transaction', 'extra'],

  data: () => ({
    activeComponent: null
  }),

  mounted () {
    const entityAction = this.transaction.asset.action
    const component = Object.values(entityConfirmationComponents).find(item => {
      return item.entityAction === entityAction
    })

    if (!component) {
      throw new Error(`[TransactionConfirmEntity] - Confirmation for action ${entityAction} not found.`)
    }

    this.activeComponent = component.name
  }
}
</script>
