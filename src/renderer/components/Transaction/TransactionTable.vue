<template>
  <div class="TransactionTable w-full">
    <vue-good-table
      :is-loading="isLoading"
      :mode="isRemote ? 'remote' : 'local'"
      :columns="columns"
      :rows="transactions"
      :sort-options="{
        enabled: true,
        initialSortBy: sortOptions
      }"
      :pagination-options="{
        enabled: hasPagination,
        dropdownAllowAll: false,
        setCurrentPage: currentPage,
        nextLabel: $t('COMMON.NEXT'),
        prevLabel: $t('COMMON.PREV'),
        rowsPerPageLabel: $t('TABLE.ROWS_PER_PAGE'),
        ofLabel: $t('COMMON.OF'),
        pageLabel: $t('TABLE.PAGE'),
        allLabel: $t('COMMON.ALL')
      }"
      :total-rows="totalRows"
      @on-row-click="onRowClick"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
      @on-per-page-change="onPerPageChange"
    >
      <div
        slot="loadingContent"
        class="flex justify-center p-5"
      >
        <Loader />
      </div>

      <template
        slot="table-row"
        slot-scope="table"
      >
        <a
          v-tooltip="{
            content: table.row.id,
            classes: 'text-xs',
            trigger: 'hover'
          }"
          v-if="table.column.field === 'id'"
          href="#"
          @click.stop="network_openExplorer('transaction', table.row.id)"
        >
          {{ table.formattedRow['id'] }}

          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </a>

        <div
          v-else-if="table.column.field === 'amount'"
          class="flex items-center justify-end"
        >
          <span
            v-tooltip="{
              content: `${$t('TRANSACTION.AMOUNT')}: ${table.formattedRow['amount']}<br>${$t('TRANSACTION.FEE')}: ${formatAmount(table.row.fee)}`,
              html: true,
              classes: 'leading-loose',
              trigger: 'hover'
            }"
            class="font-bold mr-2"
          >
            {{ table.row.isSender ? '-' : '+' }}
            {{ table.formattedRow['amount'] }}
          </span>
          <span
            :class="{
              'text-red bg-red-lightest': table.row.isSender,
              'text-green bg-green-lightest': !table.row.isSender
            }"
            class="rounded-full h-6 w-6 flex items-center justify-center"
          >
            <SvgIcon
              :name="table.row.isSender ? 'arrow-sent' : 'arrow-received'"
              class="text-center"
              view-box="0 0 8 8"
            />
          </span>
        </div>

        <div v-else-if="table.column.field === 'sender'">
          <WalletAddress :address="table.row.sender"/>
        </div>

        <div v-else-if="table.column.field === 'recipient'">
          <WalletAddress
            :address="table.row.recipient"
            :type="table.row.type"
            :asset="table.row.asset"
          />
        </div>

        <span v-else>
          {{ table.formattedRow[table.column.field] }}
        </span>
      </template>
    </vue-good-table>

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
import Loader from '@/components/utils/Loader'
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShow } from '@/components/Transaction'
import WalletAddress from '@/components/Wallet/WalletAddress'

export default {
  name: 'TransactionTable',

  components: {
    Loader,
    SvgIcon,
    TransactionShow,
    WalletAddress
  },

  props: {
    currentPage: {
      type: Number,
      required: false,
      default: 1
    },
    transactions: {
      type: Array,
      required: true
    },
    hasPagination: {
      type: Boolean,
      required: false,
      default: false
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    isRemote: {
      type: Boolean,
      required: false,
      default: false
    },
    // required if is remote
    totalRows: {
      type: Number,
      required: false,
      default: 0
    },
    sortOptions: {
      type: Object,
      required: false,
      default: () => ({
        field: 'timestamp',
        type: 'desc'
      })
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

    openTransactions (id) {
      this.network_openExplorer('transaction', id)
    },

    onRowClick ({ row }) {
      this.selected = row
    },

    onPageChange (options) {
      this.$emit('on-page-change', options)
    },

    onSortChange ({ columnIndex, sortType }) {
      const columnName = this.columns[columnIndex].field
      this.$emit('on-sort-change', { columnName, sortType })
    },

    onPerPageChange (options) {
      this.$emit('on-per-page-change', options)
    },

    onCloseModal () {
      this.selected = null
    }
  }
}
</script>
