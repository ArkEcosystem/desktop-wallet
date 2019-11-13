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

    <ListDividedItem :label="$t('WALLET_BUSINESS.NAME')">
      {{ transaction.asset.businessRegistration.name }}
    </ListDividedItem>

    <ListDividedItem :label="$t('WALLET_BUSINESS.WEBSITE')">
      {{ transaction.asset.businessRegistration.website }}
    </ListDividedItem>

    <ListDividedItem
      v-if="transaction.asset.businessRegistration.vat"
      :label="$t('WALLET_BUSINESS.VAT')"
    >
      {{ transaction.asset.businessRegistration.vat }}
    </ListDividedItem>

    <ListDividedItem
      v-if="transaction.asset.businessRegistration.repository"
      :label="$t('WALLET_BUSINESS.REPOSITORY')"
    >
      {{ transaction.asset.businessRegistration.repository }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmBusinessRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION,

  inject: ['currentWallet', 'transaction'],

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
