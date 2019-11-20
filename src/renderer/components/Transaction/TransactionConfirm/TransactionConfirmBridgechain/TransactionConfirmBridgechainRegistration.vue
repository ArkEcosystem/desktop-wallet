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

    <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.NAME')">
      {{ transaction.asset.bridgechainRegistration.name }}
    </ListDividedItem>

    <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH')">
      <span
        v-tooltip="{
          content: transaction.asset.bridgechainRegistration.genesisHash,
          trigger: 'hover',
          classes: 'text-xs'
        }"
        class="cursor-default"
      >
        {{ transaction.asset.bridgechainRegistration.genesisHash | truncateMiddle(10) }}
      </span>
    </ListDividedItem>

    <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES')">
      <div
        v-for="(seedNode, id) of transaction.asset.bridgechainRegistration.seedNodes"
        :key="id"
      >
        {{ seedNode }}
      </div>
    </ListDividedItem>

    <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.API_PORT')">
      {{ apiPort }}
    </ListDividedItem>

    <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')">
      {{ transaction.asset.bridgechainRegistration.bridgechainRepository }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmBridgechainRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION,

  inject: ['currentWallet', 'transaction'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    apiPort () {
      if (!this.transaction.asset.bridgechainRegistration.ports['@arkecosystem/core-api']) {
        return '-'
      }

      return this.transaction.asset.bridgechainRegistration.ports['@arkecosystem/core-api']
    }
  }
}
</script>
