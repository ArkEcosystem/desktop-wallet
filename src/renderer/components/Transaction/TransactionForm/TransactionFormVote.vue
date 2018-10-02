<template>
  <form
    @submit.prevent="emitContinue">
    Vote
  </form>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'

export default {
  name: 'TransactionFormVote',

  transactionType: TRANSACTION_TYPES.VOTE,

  methods: {
    emitContinue () {
      this.$emit('continue')
    }
  }
}
</script>
