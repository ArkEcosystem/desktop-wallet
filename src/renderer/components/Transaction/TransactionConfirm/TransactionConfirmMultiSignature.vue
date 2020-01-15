<template>
  <ListDivided
    class="TransactionConfirmMultiSignature"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmMultiSignature__sender"
      :label="$t('TRANSACTION.SENDER')"
    >
      {{ senderLabel }}
      <span
        v-if="senderLabel !== currentWallet.address"
        class="text-sm text-theme-page-text-light"
      >
        {{ currentWallet.address }}
      </span>
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmMultiSignature',

  transactionType: TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE,

  inject: ['currentWallet', 'transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    }
  },

  mounted () {
    console.log('mounted transaction', this.transaction)
  }
}
</script>
