<template>
  <div class="TransactionTable w-full">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <a
          v-if="data.column.field === 'id'"
          v-tooltip="{
            content: data.row.id,
            classes: 'text-xs',
            trigger: 'hover'
          }"
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

    <portal
      v-if="selected"
      to="modal"
    >
      <TransactionShow
        :transaction="selected"
        @close="onCloseModal"
      />
    </portal>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShow } from '@/components/Transaction'
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
          formatFn: this.formatLongString
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
          tdClass: 'hidden xl:table-cell',
          thClass: 'hidden xl:table-cell'
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
    }
  },

  methods: {
    formatDate (value) {
      return this.$d(value, 'short')
    },

    formatAddress (value) {
      return this.wallet_formatAddress(value, 10)
    },

    formatLongString (value) {
      return truncateMiddle(value, 10)
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

    openTransactions (id) {
      this.network_openExplorer('transaction', id)
    },

    onSortChange ({ columnIndex, sortType }) {
      const columnName = this.columns[columnIndex].field
      this.$emit('on-sort-change', { columnName, sortType })
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
