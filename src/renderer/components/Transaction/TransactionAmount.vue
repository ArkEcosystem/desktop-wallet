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
      const amount = this.currency_toBuilder(0)
      if (this.transaction.asset && this.transaction.asset.payments) {
        for (const payment of this.transaction.asset.payments) {
          amount.add(payment.amount)
        }
      } else if (this.transaction.amount) {
        amount.add(this.transaction.amount)
      }

      return amount.value
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
