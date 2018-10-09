<template>
  <span
    :class="{
      'text-red': transaction.isSender,
      'text-green': transaction.isReceiver && isTransfer,
  }">{{ formatUnit(transaction.amount) }}</span>
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
    isTransfer () {
      if (this.transaction.type !== undefined) {
        // 0 = transfer, 6 = timelock transfer, 7 = multipayment
        return this.transaction.type === 0 || this.transaction.type === 6 || this.transaction.type === 7
      }
      return false
    }
  },

  methods: {
    formatUnit (value) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network' })
    }
  }
}
</script>
