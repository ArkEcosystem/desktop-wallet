<template>
  <span
    :class="{
      'text-red': transaction.isSender && !transaction.isRecipient && totalAmount,
      'text-green': !transaction.isSender && transaction.isRecipient && isTransfer,
    }"
  >
    {{ transaction.isSender ? '-' : '+' }}
    {{ formatter_networkCurrency(totalAmount) }}
  </span>
</template>

<script>
import TransactionService from '@/services/transaction'

export default {
  name: 'TransactionAmount',

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  computed: {
    totalAmount () {
      return TransactionService.getAmount(this, this.transaction, this.wallet_fromRoute)
    },

    isTransfer () {
      return TransactionService.isTransfer(this.transaction)
    }
  }
}
</script>
