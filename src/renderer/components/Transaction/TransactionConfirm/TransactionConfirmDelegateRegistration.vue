<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem :label="$t('WALLET_DELEGATES.USERNAME')">
      {{ getUsername(transaction) }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  inject: ['transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  methods: {
    getUsername (transaction) {
      if (transaction.asset && transaction.asset.delegate) {
        return transaction.asset.delegate.username
      }
      return ''
    }
  }
}
</script>
