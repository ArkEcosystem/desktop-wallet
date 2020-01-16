<template>
  <ListDivided
    class="TransactionConfirmBridgechainResignation"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmBridgechainResignation__sender"
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
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmBridgechainResignation',

  transactionType: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION,

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

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
