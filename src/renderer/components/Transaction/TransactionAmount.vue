<template>
  <span
    :class="{
      'text-red': transaction.isSender && totalAmount,
      'text-green': !transaction.isSender && isTransfer,
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
      if (this.transaction.type !== undefined) {
        // 0 = transfer, 6 = timelock transfer, 7 = multipayment
        return this.transaction.type === 0 || this.transaction.type === 6 || this.transaction.type === 7
      }
      return false
    }
  }
}
</script>
