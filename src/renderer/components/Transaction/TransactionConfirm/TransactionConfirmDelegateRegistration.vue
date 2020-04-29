<template>
  <ListDivided
    class="TransactionConfirmDelegateRegistration"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmDelegateRegistration__sender"
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

    <ListDividedItem
      class="TransactionConfirmDelegateRegistration__username"
      :label="$t('WALLET_DELEGATES.USERNAME')"
    >
      {{ username }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmDelegateRegistration',

  transactionType: TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION,

  inject: ['currentWallet', 'transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    username () {
      if (this.transaction.asset && this.transaction.asset.delegate) {
        return this.transaction.asset.delegate.username
      }

      return ''
    }
  }
}
</script>
