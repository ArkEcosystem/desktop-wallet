<template>
  <ListDivided
    class="TransactionConfirmMultiPayment"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmMultiPayment__sender"
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

    <ListDividedItem
      class="TransactionConfirmMultiPayment__recipients"
      :label="$t('TRANSACTION.RECIPIENTS')"
      item-value-class="items-center"
    >
      <TransactionMultiPaymentList
        :title="null"
        :items="payments"
        readonly
      />
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import TransactionMultiPaymentList from '@/components/Transaction/TransactionMultiPaymentList'

export default {
  name: 'TransactionConfirmMultiPayment',

  transactionType: TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT,

  inject: ['currentWallet', 'transaction'],

  components: {
    ListDivided,
    ListDividedItem,
    TransactionMultiPaymentList
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    payments () {
      return this.transaction.asset.payments.reduce((payments, payment, index) => {
        payments.push({
          id: index + 1,
          ...payment
        })
        return payments
      }, [])
    }
  }
}
</script>

<style scoped>
.TransactionConfirmMultiPayment__recipients {
  @apply .overflow-y-auto;
  max-height: 200px;
}
</style>
