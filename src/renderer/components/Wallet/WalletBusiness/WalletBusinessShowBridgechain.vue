<template>
  <ModalWindow
    :title="$t('TRANSACTION.TRANSACTION')"
    container-classes="WalletBusinessShowBridgechain"
    @close="emitClose"
  >
    <ListDivided>
      <ListDividedItem
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.NAME')"
        :value="bridgechain.name"
        class="WalletBusinessShowBridgechain__name"
      />

      <ListDividedItem
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES')"
        class="WalletBusinessShowBridgechain__seed-nodes"
      >
        <div
          v-for="(seedNode, id) of bridgechain.seedNodes"
          :key="id"
          class="WalletBusinessShowBridgechain__seed-nodes__item text-right"
        >
          {{ seedNode }}
        </div>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH')"
        class="WalletBusinessShowBridgechain__genesis-hash"
      >
        <span
          v-tooltip="{
            content: bridgechain.genesisHash,
            trigger: 'hover',
            classes: 'text-xs'
          }"
          class="WalletBusinessShowBridgechain__genesis-hash__item cursor-default"
        >
          {{ bridgechain.genesisHash | truncateMiddle(10) }}
        </span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')"
        class="WalletBusinessShowBridgechain__bridgechain-repo"
      >
        <a
          class="flex items-center whitespace-no-wrap"
          href="#"
          @click.stop="electron_openExternal(bridgechain.bridgechainRepository)"
        >
          <span
            v-tooltip="{
              content: bridgechain.bridgechainRepository,
              classes: 'text-xs',
              trigger: 'hover'
            }"
            class="WalletBusinessShowBridgechain__bridgechain-repo__item mr-1"
          >
            {{ bridgechain.bridgechainRepository }}
          </span>

          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </a>
      </ListDividedItem>

      <ListDividedItem
        v-if="bridgechain.bridgechainAssetRepository"
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_ASSET_REPOSITORY')"
        class="WalletBusinessShowBridgechain__bridgechain-asset-repo"
      >
        <a
          class="flex items-center whitespace-no-wrap"
          href="#"
          @click.stop="electron_openExternal(bridgechain.bridgechainAssetRepository)"
        >
          <span
            v-tooltip="{
              content: bridgechain.bridgechainAssetRepository,
              classes: 'text-xs',
              trigger: 'hover'
            }"
            class="WalletBusinessShowBridgechain__bridgechain-asset-repo__item mr-1"
          >
            {{ bridgechain.bridgechainAssetRepository }}
          </span>

          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </a>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.API_PORT')"
        :value="bridgechain.ports['@arkecosystem/core-api']"
      />
    </ListDivided>

    <div
      v-if="!isResigned"
      class="flex"
    >
      <div class="flex-1">
        <ButtonModal
          slot="primaryButton"
          :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BUTTON.UPDATE')"
          class="ButtonGeneric blue-button"
        >
          <template slot-scope="{ toggle, isOpen }">
            <TransactionModal
              v-if="isOpen"
              :type="5"
              :group="2"
              :bridgechain="bridgechain"
              @cancel="closeTransactionModal(toggle, isOpen)"
              @sent="closeTransactionModal(toggle, isOpen)"
            />
          </template>
        </ButtonModal>
      </div>

      <div class="flex-1">
        <ButtonModal
          slot="primaryButton"
          :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BUTTON.RESIGN')"
          class="ButtonGeneric blue-button"
        >
          <template slot-scope="{ toggle, isOpen }">
            <TransactionModal
              v-if="isOpen"
              :type="4"
              :group="2"
              :bridgechain="bridgechain"
              @cancel="closeTransactionModal(toggle, isOpen)"
              @sent="closeTransactionModal(toggle, isOpen)"
            />
          </template>
        </ButtonModal>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { ButtonModal } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletBusinessShowBridgechain',

  components: {
    ListDivided,
    ListDividedItem,
    ModalWindow,
    ButtonModal,
    SvgIcon,
    TransactionModal
  },

  props: {
    bridgechain: {
      type: Object,
      required: true
    }
  },

  computed: {
    isResigned () {
      return !!this.bridgechain.isResigned
    }
  },

  methods: {
    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen && typeof toggleMethod === 'function') {
        toggleMethod()
      }

      this.emitClose()
    },

    emitClose () {
      this.$emit('close', 'navigateToTransactions')
    }
  }
}
</script>

<style>
.WalletBusinessShowBridgechain {
  min-width: 35rem
}
</style>
