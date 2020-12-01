<template>
  <TransactionConfirmRegistration
    mode="UPDATE"
    :current-wallet="currentWallet"
    :transaction="transaction"
  />
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import TransactionConfirmRegistration from './TransactionConfirmEntityRegistration'

export default {
  name: 'TransactionConfirmEntityUpdate',

  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.UPDATE,

  components: {
    TransactionConfirmRegistration
  },

  props: {
    currentWallet: {
      type: Object,
      required: true
    },
    transaction: {
      type: Object,
      required: true
    }
  }
}
</script>
