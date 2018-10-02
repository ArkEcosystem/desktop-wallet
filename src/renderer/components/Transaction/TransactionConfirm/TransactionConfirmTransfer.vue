<template>
  <ListDivided :is-floating-label="true">
    <!-- TODO: Add header + identicons + amount -->
    <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
      {{ formatCurrency(transaction.amount) }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.RECIPIENT')">
      {{ transaction.recipientId }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.VENDOR_FIELD')">
      {{ transaction.vendorField }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.FEE')">
      {{ formatCurrency(transaction.fee) }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmTransfer',

  transactionType: TRANSACTION_TYPES.TRANSFER,

  inject: ['transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  methods: {
    formatCurrency (value) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network' })
    }
  }
}
</script>
