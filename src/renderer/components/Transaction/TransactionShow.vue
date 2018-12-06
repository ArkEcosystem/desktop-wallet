<template>
  <ModalWindow
    :title="$t('TRANSACTION.TRANSACTION')"
    container-classes="TransactionShow"
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
          v-if="transaction.confirmations > 0"
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
        {{ wallet_formatAddress(transaction.sender, 10) }}
        <ButtonClipboard
          :value="transaction.sender"
          class="text-theme-page-text-light mx-1"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          @click="openAddress(transaction.sender)"
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
        {{ wallet_formatAddress(transaction.recipient, 10) }}
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
        <span v-if="transaction.isExpired">
          {{ $t('TRANSACTION.EXPIRED') }}
        </span>
        <span v-else-if="!isWellConfirmed">
          {{ transaction.confirmations }}
        </span>
        <span v-else>
          {{ $t('TRANSACTION.WELL_CONFIRMED') }}
        </span>

        <span
          v-show="!transaction.isExpired"
          v-tooltip="{
            content: $t('TRANSACTION.CONFIRMATION_COUNT', [transaction.confirmations]),
            trigger: 'hover'
          }"
          class="ml-1"
        >
          <SvgIcon
            name="time"
            view-box="0 0 12 13"
          />
        </span>
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

    <div v-show="transaction.isExpired">
      <ButtonGeneric
        :label="$t('TRANSACTION.RESEND')"
        @click="emitResend"
      />
      <ButtonGeneric
        :label="$t('TRANSACTION.DISCARD')"
        class="ml-4"
        @click="emitDiscard"
      />
    </div>
  </ModalWindow>
</template>

<script>
import { at } from 'lodash'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { ButtonClipboard, ButtonGeneric } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import TransactionAmount from './TransactionAmount'
import truncateMiddle from '@/filters/truncate-middle'

export default {
  name: 'TransactionShow',

  components: {
    ButtonGeneric,
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
      return this.transaction.confirmations >= (this.numberOfActiveDelegates || 51)
    },
    numberOfActiveDelegates () {
      return at(this, 'session_network.constants.activeDelegates') || 51
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
    },

    async emitResend () {
      await this.$client.broadcastTransaction(this.transaction.raw)

      this.$success(this.$t('TRANSACTION.RESENT_NOTICE', { transactionId: truncateMiddle(this.transaction.id) }))
      this.$emit('close')
    },

    emitDiscard () {
      this.$store.dispatch('transaction/delete', this.transaction)
      this.$emit('close')
      this.$eventBus.emit('wallet:reload')
    }
  }
}
</script>

<style>
.TransactionShow {
  min-width: 35rem
}
</style>
