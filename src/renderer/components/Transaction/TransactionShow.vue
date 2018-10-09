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

      <ListDividedItem :label="$t('TRANSACTION.SENDER')">
        <a
          href="#"
          @click.stop="openAddress(transaction.sender)"
        >
          {{ wallet_formatAddress(transaction.sender) }}
        </a>
      </ListDividedItem>

      <ListDividedItem
        v-if="transaction.recipient"
        :label="$t('TRANSACTION.RECIPIENT')"
      >
        <a
          href="#"
          @click.stop="openAddress(transaction.recipient)"
        >
          {{ wallet_formatAddress(transaction.recipient) }}
        </a>
      </ListDividedItem>

      <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
        <TransactionAmount :transaction="transaction" />
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.FEE')"
        :value="formatUnit(transaction.fee)"
      />

      <ListDividedItem :label="$t('TRANSACTION.CONFIRMATIONS')">
        <span>{{ transaction.confirmations }}</span>
        <!-- TODO: Well confirmed -->
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
import { TransactionAmount } from '@/components/Transaction'

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

  methods: {
    formatUnit (value) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network' })
    },

    openTransaction () {
      this.network_openExplorer('transaction', this.transaction.id)
    },

    openAddress (address) {
      this.network_openExplorer('address', address)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.TransactionShow >>> .ModalWindow__container {
  min-width: 35rem
}
</style>
