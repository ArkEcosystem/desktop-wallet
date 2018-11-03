<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
      {{ formatter_networkCurrency(transaction.amount) }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.RECIPIENT')">
      {{ transaction.recipientId }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.VENDOR_FIELD')">
      {{ transaction.vendorField }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.FEE')">
      {{ formatter_networkCurrency(transaction.fee) }}
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
  }
}
</script>
