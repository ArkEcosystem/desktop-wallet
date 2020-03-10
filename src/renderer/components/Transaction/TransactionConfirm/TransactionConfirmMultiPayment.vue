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
      class="TransactionConfirmMultiPayment__amount"
      :label="$t('TRANSACTION.MULTI_PAYMENT.TOTAL_AMOUNT')"
    >
      {{ formatter_networkCurrency(totalAmount) }}
    </ListDividedItem>

    <ListDividedItem
      class="TransactionConfirmMultiPayment__recipients"
      :label="`${$t('TRANSACTION.RECIPIENTS')} - ${payments.length}`"
      item-value-class="items-center"
    >
      <TransactionMultiPaymentList
        :title="null"
        :items="payments"
        readonly
      />
    </ListDividedItem>

    <ListDividedItem
      v-if="transaction.vendorField"
      class="TransactionConfirmMultiPayment__vendorfield"
      :label="$t('TRANSACTION.VENDOR_FIELD')"
      item-value-class="w-full break-words"
    >
      {{ transaction.vendorField }}
    </ListDividedItem>

    <ListDividedItem
      class="TransactionConfirmMultiPayment__fee"
      :label="$t('TRANSACTION.FEE')"
    >
      {{ formatter_networkCurrency(transaction.fee) }}
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

    totalAmount () {
      const amount = this.currency_toBuilder(0)

      for (const payment of this.payments) {
        amount.add(payment.amount)
      }

      return amount.value
    },

    payments () {
      return this.transaction.asset.payments
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
