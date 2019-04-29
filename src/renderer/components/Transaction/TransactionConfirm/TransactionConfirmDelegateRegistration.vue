<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem :label="$t('TRANSACTION.SENDER')">
      {{ senderLabel }}
      <span
        v-if="senderLabel !== currentWallet.address"
        class="text-sm text-theme-page-text-light"
      >
        {{ currentWallet.address }}
      </span>
    </ListDividedItem>

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

  inject: ['currentWallet', 'transaction'],

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
    },

    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    }
  }
}
</script>
