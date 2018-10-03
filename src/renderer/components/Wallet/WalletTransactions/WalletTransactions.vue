<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="transactions"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'timestamp', type: 'desc'}
      }"
      class="WalletTransactions"
      @on-row-click="onRowClick"
    >
      <template
        slot="table-row"
        slot-scope="table"
      >
        <a
          v-if="table.column.field === 'id'"
          href="#"
          @click.stop="network_openExplorer('transaction', table.row.id)"
        >
          {{ table.formattedRow['id'] }}
        </a>

        <div
          v-else-if="table.column.field === 'totalAmount'"
          class="flex items-center justify-end"
        >
          <span class="font-bold mr-2">
            {{ table.row.isSender ? '-' : '+' }}
            {{ table.formattedRow['totalAmount'] }}
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
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShow } from '@/components/Transaction'

export default {
  name: 'WalletTransactions',

  components: {
    SvgIcon,
    TransactionShow
  },

  data: () => ({
    transactions: [],
    showModal: false,
    selected: null
  }),

  computed: {
    currentNetwork () {
      return this.$store.getters['session/currentNetwork']
    },

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
          field: 'sender',
          formatFn: this.formatLongString
        },
        {
          label: this.$t('TRANSACTION.RECIPIENT'),
          field: 'recipient',
          formatFn: this.formatLongString
        },
        {
          label: this.$t('TRANSACTION.AMOUNT'),
          type: 'number',
          field: 'totalAmount',
          formatFn: this.formatAmount,
          tdClass: 'text-right',
          thClass: 'text-right'
        }
      ]
    }
  },

  mounted () {
    this.fetchTransactions()
  },

  methods: {
    async fetchTransactions () {
      if (!this.wallet_fromRoute) return

      try {
        this.transactions = await this.$client.fetchTransactions(this.wallet_fromRoute.address)
      } catch (error) {
        console.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
      }
    },

    formatDate (value) {
      return this.$d(value, 'short')
    },

    formatLongString (value) {
      return truncateMiddle(value, 10)
    },

    formatAmount (value) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network' })
    },

    openTransactions (id) {
      this.network_openExplorer('transaction', id)
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
