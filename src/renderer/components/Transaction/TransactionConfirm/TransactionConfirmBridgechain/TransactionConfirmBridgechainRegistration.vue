<template>
  <ListDivided
    class="TransactionConfirmBridgechainRegistration"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmBridgechainRegistration__sender"
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
      class="TransactionConfirmBridgechainRegistration__name"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.NAME')"
    >
      {{ transaction.asset.bridgechainRegistration.name }}
    </ListDividedItem>

    <ListDividedItem
      class="TransactionConfirmBridgechainRegistration__genesis-hash"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH')"
    >
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

    <ListDividedItem
      class="TransactionConfirmBridgechainRegistration__seed-nodes"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES')"
    >
      <div
        v-for="(seedNode, id) of transaction.asset.bridgechainRegistration.seedNodes"
        :key="id"
      >
        {{ seedNode }}
      </div>
    </ListDividedItem>

    <ListDividedItem
      class="TransactionConfirmBridgechainRegistration__api-port"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.API_PORT')"
    >
      {{ apiPort }}
    </ListDividedItem>

    <ListDividedItem
      class="TransactionConfirmBridgechainRegistration__bridgechain-repo"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')"
    >
      {{ transaction.asset.bridgechainRegistration.bridgechainRepository }}
    </ListDividedItem>

    <ListDividedItem
      v-if="transaction.asset.bridgechainRegistration.bridgechainAssetRepository"
      class="TransactionConfirmBridgechainRegistration__bridgechain-asset-repo"
      :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_ASSET_REPOSITORY')"
    >
      {{ transaction.asset.bridgechainRegistration.bridgechainAssetRepository }}
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
      if (
        !this.transaction.asset.bridgechainRegistration.ports ||
        (
          this.transaction.asset.bridgechainRegistration.ports &&
          !this.transaction.asset.bridgechainRegistration.ports['@arkecosystem/core-api']
        )
      ) {
        return null
      }

      return this.transaction.asset.bridgechainRegistration.ports['@arkecosystem/core-api']
    }
  }
}
</script>
