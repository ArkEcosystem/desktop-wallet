<template>
  <span />
</template>

<script>
import { TRANSACTION_TYPES } from '@config'

export default {
  name: 'TransactionConfirmVote',

  transactionType: TRANSACTION_TYPES.VOTE,

  inject: ['transaction']
}
</script>
