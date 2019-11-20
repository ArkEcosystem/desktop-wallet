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
      />

      <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES')">
        <div
          v-for="(seedNode, id) of bridgechain.seedNodes"
          :key="id"
        >
          {{ seedNode }}
        </div>
      </ListDividedItem>

      <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH')">
        <span
          v-tooltip="{
            content: bridgechain.genesisHash,
            trigger: 'hover',
            classes: 'text-xs'
          }"
          class="cursor-default"
        >
          {{ bridgechain.genesisHash | truncateMiddle(10) }}
        </span>
      </ListDividedItem>

      <ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')">
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
            class="mr-1"
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
        :label="$t('WALLET_BUSINESS.BRIDGECHAIN.API_PORT')"
        :value="bridgechain.ports['@arkecosystem/core-api']"
      />
    </ListDivided>

    <div class="flex">
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
          v-if="canResign"
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
    canResign () {
      return !this.bridgechain.resigned
    }
  },

  methods: {
    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen) {
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
