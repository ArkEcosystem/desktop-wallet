<template>
  <ListDivided
    class="TransactionConfirmDelegateResignation"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmDelegateResignation__sender"
      :label="$t('TRANSACTION.SENDER')"
      item-value-class="w-full"
    >
      <span class="break-words">
        {{ senderLabel }}
      </span>
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
  name: 'TransactionConfirmDelegateResignation',

  transactionType: TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION,

  inject: ['currentWallet'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    }
  }
}
</script>
