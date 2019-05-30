<template>
  <span
    v-if="!isWellConfirmed"
    v-tooltip="{
      content: $t('TRANSACTION.CONFIRMATION_COUNT', { confirmations: confirmations }),
      classes: 'text-xs',
      trigger: showTooltip ? 'hover' : 'manual',
      container: tooltipContainer
    }"
    :class="{
      'text-theme-transaction-confirmations-sent bg-theme-transaction-sent': isSender,
      'text-theme-transaction-confirmations-received bg-theme-transaction-received': !isSender
    }"
    class="Transaction__confirmations rounded-full h-6 w-6 flex items-center justify-center"
  >
    <SvgIcon
      name="time"
      view-box="0 0 12 13"
    />
  </span>

  <span
    v-else
    v-tooltip="{
      content: $t('TRANSACTION.WELL_CONFIRMED_COUNT', { confirmations }),
      classes: 'text-xs',
      trigger: showTooltip ? 'hover' : 'manual',
      container: tooltipContainer
    }"
    :class="{
      'text-theme-transaction-sent-arrow bg-theme-transaction-sent': isSender,
      'text-theme-transaction-received-arrow bg-theme-transaction-received': !isSender
    }"
    class="rounded-full h-6 w-6 flex items-center justify-center"
  >
    <SvgIcon
      :name="isSender ? 'arrow-sent' : 'arrow-received'"
      class="text-center"
      view-box="0 0 8 8"
    />
  </span>
</template>

<script>
import { at } from 'lodash'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'TransactionStatusIcon',

  components: {
    SvgIcon
  },

  props: {
    isSender: {
      type: Boolean,
      required: false,
      default: false
    },
    confirmations: {
      type: Number,
      required: false,
      default: 0
    },
    showTooltip: {
      type: Boolean,
      required: false,
      default: false
    },
    tooltipContainer: {
      type: String,
      required: false,
      default: undefined
    }
  },

  computed: {
    isWellConfirmed () {
      return this.confirmations >= this.numberOfActiveDelegates
    },

    numberOfActiveDelegates () {
      return at(this, 'session_network.constants.activeDelegates') || 51
    }
  }
}
</script>
