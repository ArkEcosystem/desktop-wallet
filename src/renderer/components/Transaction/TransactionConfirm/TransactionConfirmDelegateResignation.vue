<template>
  <ListDivided
    class="TransactionConfirmDelegateResignation"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmDelegateResignation__sender"
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
import ListDivided from '@/components/ListDivided/ListDivided'
import ListDividedItem from '@/components/ListDivided/ListDividedItem'

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
