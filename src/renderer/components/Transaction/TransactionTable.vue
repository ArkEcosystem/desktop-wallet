<template>
  <div class="TransactionTable w-full">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :row-style-class="formatRow"
      v-on="$listeners"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div v-if="data.column.field === 'id' && data.row.confirmations > 0">
          <a
            v-tooltip="{
              content: data.row.id,
              classes: 'text-xs',
              trigger: 'hover'
            }"
            class="whitespace-no-wrap"
            href="#"
            @click.stop="network_openExplorer('transaction', data.row.id)"
          >
            {{ data.formattedRow['id'] }}

            <SvgIcon
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light"
            />
          </a>
        </div>

        <div
          v-else-if="data.column.field === 'amount'"
          class="flex items-center justify-end"
        >
          <span
            v-tooltip="{
              content: `${$t('TRANSACTION.AMOUNT')}: ${data.formattedRow['amount']}<br>${$t('TRANSACTION.FEE')}: ${formatAmount(data.row.fee)}`,
              html: true,
              classes: 'leading-loose',
              trigger: 'hover',
              placement: 'left'
            }"
            class="font-bold mr-2 whitespace-no-wrap"
          >
            {{ data.row.isSender ? '-' : '+' }}
            {{ data.formattedRow['amount'] }}
          </span>
          <span
            v-if="!isWellConfirmed(data.row.confirmations)"
            v-tooltip="{
              content: $t('TRANSACTION.CONFIRMATION_COUNT', [data.row.confirmations]),
              classes: 'text-xs',
              trigger: 'hover'
            }"
            :class="{
              'text-theme-transaction-confirmations-sent bg-theme-transaction-sent': data.row.isSender,
              'text-theme-transaction-confirmations-received bg-theme-transaction-received': !data.row.isSender
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
              content: $t('TRANSACTION.WELL_CONFIRMED_COUNT', { confirmations: data.row.confirmations }),
              classes: 'text-xs',
              trigger: 'hover'
            }"
            :class="{
              'text-theme-transaction-sent-arrow bg-theme-transaction-sent': data.row.isSender,
              'text-theme-transaction-received-arrow bg-theme-transaction-received': !data.row.isSender
            }"
            class="rounded-full h-6 w-6 flex items-center justify-center"
          >
            <SvgIcon
              :name="data.row.isSender ? 'arrow-sent' : 'arrow-received'"
              class="text-center"
              view-box="0 0 8 8"
            />
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'sender'"
          class="overflow-hidden truncate max-w-xxs"
        >
          <WalletAddress :address="data.row.sender" />
        </div>

        <div
          v-else-if="data.column.field === 'recipient'"
          class="overflow-hidden truncate max-w-xxs"
        >
          <WalletAddress
            :address="data.row.recipient"
            :type="data.row.type"
            :asset="data.row.asset"
          />
        </div>

        <span v-else>
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>

    <Portal
      v-if="selected"
      to="modal"
    >
      <TransactionShow
        :transaction="selected"
        @close="onCloseModal"
      />
    </Portal>
  </div>
</template>

<script>
import { at } from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'
import TransactionShow from './TransactionShow'
import WalletAddress from '@/components/Wallet/WalletAddress'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'TransactionTable',

  components: {
    SvgIcon,
    TableWrapper,
    TransactionShow,
    WalletAddress
  },

  props: {
    hasShortId: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    showModal: false,
    selected: null
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('TRANSACTION.ID'),
          field: 'id',
          formatFn: this.formatTransactionId
        },
        {
          label: this.$t('COMMON.DATE'),
          field: 'timestamp',
          type: 'date',
          formatFn: this.formatDate,
          tdClass: 'text-center',
          thClass: 'text-center'
        },
        {
          label: this.$t('TRANSACTION.SENDER'),
          field: 'sender'
        },
        {
          label: this.$t('TRANSACTION.RECIPIENT'),
          field: 'recipient'
        },
        {
          label: this.$t('TRANSACTION.VENDOR_FIELD'),
          field: 'vendorField',
          formatFn: this.formatSmartbridge,
          tdClass: this.hasShortId ? 'hidden xxl:table-cell' : 'hidden xl:table-cell',
          thClass: this.hasShortId ? 'hidden xxl:table-cell' : 'hidden xl:table-cell'
        },
        {
          label: this.$t('TRANSACTION.AMOUNT'),
          type: 'number',
          field: 'amount',
          formatFn: this.formatAmount,
          tdClass: 'text-right',
          thClass: 'text-right'
        }
      ]
    },
    numberOfActiveDelegates () {
      return at(this, 'session_network.constants.activeDelegates') || 51
    }
  },

  methods: {
    formatDate (value) {
      return this.$d(value, 'short')
    },

    formatAddress (value) {
      return this.wallet_formatAddress(value, 10)
    },

    formatTransactionId (value) {
      return this.hasShortId ? truncateMiddle(value, 6) : truncateMiddle(value, 10)
    },

    formatAmount (value) {
      return this.formatter_networkCurrency(value)
    },

    formatSmartbridge (value) {
      if (value.length > 43) {
        return `${value.slice(0, 40)}...`
      }
      return value
    },

    formatRow (row) {
      const classes = [
        row.confirmations === 0 ? 'unconfirmed' : 'confirmed'
      ]

      if (row.expired) {
        classes.push('expired')
      }

      return classes.join(' ')
    },

    isWellConfirmed (confirmations) {
      return confirmations >= this.numberOfActiveDelegates
    },

    openTransactions (id) {
      this.network_openExplorer('transaction', id)
    },

    onSortChange ({ columnIndex, sortType }) {
      if (this.columns[columnIndex]) {
        const columnName = this.columns[columnIndex].field
        this.$emit('on-sort-change', { columnName, sortType })
      }
    },

    onRowClick ({ row }) {
      this.selected = row
    },

    onCloseModal () {
      this.selected = null
    }
  }
}
</script>

<style>
.TransactionTable tr.unconfirmed {
  @apply opacity-50 text-theme-page-text;
}
.TransactionTable tr.unconfirmed .Transaction__confirmations {
  @apply text-theme-page-text bg-theme-page-instructions-background;
}
.TransactionTable tr.expired {
  @apply line-through;
}
</style>
