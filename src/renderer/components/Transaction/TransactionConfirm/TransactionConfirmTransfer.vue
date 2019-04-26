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

    <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
      {{ formatter_networkCurrency(transaction.amount) }}
    </ListDividedItem>

    <ListDividedItem :label="$t('TRANSACTION.RECIPIENT')">
      {{ recipientLabel }}
      <span
        v-if="recipientLabel !== transaction.recipientId"
        class="text-sm text-theme-page-text-light"
      >
        {{ transaction.recipientId }}
      </span>
    </ListDividedItem>

    <ListDividedItem
      v-if="transaction.vendorField"
      :label="$t('TRANSACTION.VENDOR_FIELD')"
    >
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

  inject: ['currentWallet', 'transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    recipientLabel () {
      return this.wallet_formatAddress(this.transaction.recipientId)
    },

    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    }
  }
}
</script>
