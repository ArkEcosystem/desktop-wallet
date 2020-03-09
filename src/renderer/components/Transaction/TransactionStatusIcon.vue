<template>
  <span
    v-if="!isWellConfirmed && showWaitingConfirmations"
    v-tooltip="{
      content: $t('TRANSACTION.CONFIRMATION_COUNT', { confirmations: confirmations }),
      classes: 'text-xs',
      trigger: showTooltip ? 'hover' : 'manual',
      container: tooltipContainer
    }"
    :class="{
      'TransactionStatus__transferToSelf': isTransferToSelf,
      'text-theme-transaction-confirmations-sent bg-theme-transaction-sent': isSender && !isTransferToSelf,
      'text-theme-transaction-confirmations-received bg-theme-transaction-received': !isSender && !isTransferToSelf
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
      'TransactionStatus__transferToSelf': isTransferToSelf,
      'text-theme-transaction-sent-arrow bg-theme-transaction-sent': isSender && !isTransferToSelf,
      'text-theme-transaction-received-arrow bg-theme-transaction-received': !isSender && !isTransferToSelf
    }"
    class="rounded-full h-6 w-6 flex items-center justify-center"
  >
    <SvgIcon
      v-if="!isTransferToSelf"
      :name="isSender ? 'arrow-sent' : 'arrow-received'"
      class="text-center"
      view-box="0 0 8 8"
    />

    <div
      v-else
      class="w-1/2 h-1/2 rounded-full bg-grey"
    />
  </span>
</template>

<script>
import { at } from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import TransactionService from '@/services/transaction'

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
    isRecipient: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: Number,
      required: false,
      default: null
    },
    typeGroup: {
      type: Number,
      required: false,
      default: null
    },
    confirmations: {
      type: Number,
      required: false,
      default: 0
    },
    showWaitingConfirmations: {
      type: Boolean,
      required: false,
      default: true
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
    isTransferToSelf () {
      return this.isSender === this.isRecipient && TransactionService.isTransfer(this.$options.propsData)
    },

    isWellConfirmed () {
      return this.confirmations >= this.numberOfActiveDelegates
    },

    numberOfActiveDelegates () {
      return at(this, 'session_network.constants.activeDelegates') || 51
    }
  }
}
</script>

<style scoped>
.TransactionStatus__transferToSelf {
  background-color: var(--theme-button-light);
}
</style>
