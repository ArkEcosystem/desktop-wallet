<template>
  <ModalWindow
    :title="$t('TRANSACTION.TRANSACTION')"
    class="TransactionShow"
    @close="emitClose"
  >
    <ListDivided>
      <ListDividedItem :label="$t('TRANSACTION.ID')">
        <span
          v-tooltip="{
            content: transaction.id,
            trigger: 'hover',
            classes: 'text-xs'
          }"
          class="cursor-default"
        >
          {{ transaction.id | truncateMiddle }}
        </span>
        <ButtonClipboard
          :value="transaction.id"
          class="text-theme-page-text-light mx-1"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          @click="openTransaction"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        v-if="transaction.blockId"
        :label="$t('TRANSACTION.BLOCK_ID')"
      >
        {{ transaction.blockId }}
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          @click="openBlock"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem :label="$t('TRANSACTION.SENDER')">
        {{ wallet_formatAddress(transaction.sender) }}
        <ButtonClipboard
          :value="transaction.sender"
          class="text-theme-page-text-light mx-1"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          @click="openAddress(transaction.recipient)"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        v-if="transaction.recipient"
        :label="$t('TRANSACTION.RECIPIENT')"
      >
        {{ wallet_formatAddress(transaction.recipient) }}
        <ButtonClipboard
          :value="transaction.recipient"
          class="text-theme-page-text-light mx-1"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          @click="openAddress(transaction.recipient)"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
        <TransactionAmount :transaction="transaction" />
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.FEE')"
        :value="formatter_networkCurrency(transaction.fee)"
      />

      <ListDividedItem :label="$t('TRANSACTION.CONFIRMATIONS')">
        <span v-if="!isWellConfirmed">{{ transaction.confirmations }}</span>
        <span
          v-else
          v-tooltip="{
            content: $t('TRANSACTION.CONFIRMATION_COUNT', [transaction.confirmations]),
            trigger: 'hover',
            classes: 'text-xs'
          }"
        >{{ $t('TRANSACTION.WELL_CONFIRMED') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.TIMESTAMP')"
        :value="$d(transaction.timestamp, 'long')"
      />

      <ListDividedItem
        v-if="transaction.vendorField"
        :value="transaction.vendorField"
        :label="$t('TRANSACTION.VENDOR_FIELD')"
      />
    </ListDivided>
  </ModalWindow>
</template>

<script>
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { ButtonClipboard } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import TransactionAmount from './TransactionAmount'

export default {
  name: 'TransactionShow',

  components: {
    ListDivided,
    ListDividedItem,
    ModalWindow,
    ButtonClipboard,
    SvgIcon,
    TransactionAmount
  },

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  computed: {
    isWellConfirmed () {
      return this.transaction.confirmations >= (this.session_network.constants.activeDelegates || 51)
    }
  },

  methods: {
    openTransaction () {
      this.network_openExplorer('transaction', this.transaction.id)
    },

    openAddress (address) {
      this.network_openExplorer('address', address)
    },

    openBlock (address) {
      this.network_openExplorer('block', this.transaction.blockId)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.TransactionShow /deep/ .ModalWindow__container {
  min-width: 35rem
}
</style>
