<template>
  <ListDivided
    class="TransactionConfirmEntityResignation"
    :is-floating-label="true"
  >
    <ListDividedItem
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
      :label="$t('ENTITY.TYPE')"
      item-value-class="w-full"
    >
      <span>{{ $t(`TRANSACTION.TYPE.${entityTypeLabel}_ENTITY_RESIGNATION`) }}</span>
    </ListDividedItem>

    <ListDividedItem
      :label="$t('ENTITY.TYPE')"
      item-value-class="w-full"
    >
      <span>{{ entity.data.name }}</span>
    </ListDividedItem>

    <ListDividedItem
      :label="$t('TRANSACTION.FEE')"
    >
      {{ formatter_networkCurrency(transaction.fee) }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmEntityResignation',

  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.RESIGN,

  components: {
    ListDivided,
    ListDividedItem
  },

  props: {
    currentWallet: {
      type: Object,
      required: true
    },
    transaction: {
      type: Object,
      required: true
    }
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    entityTypeLabel () {
      const labels = {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: 'BUSINESS',
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: 'PRODUCT',
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: 'PLUGIN',
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: 'MODULE',
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: 'DELEGATE'
      }

      return labels[this.transaction.asset.type]
    },

    entity () {
      return this.$store.getters['entity/byRegistrationId'](this.transaction.id)
    }
  }
}
</script>
