<template>
  <vue-good-table
    :columns="columns"
    :rows="transactions"
    :sort-options="{
      enabled: true,
      initialSortBy: {field: 'timestamp', type: 'desc'}
    }"
    class="WalletTransactions"
  >
    <template
      slot="table-row"
      slot-scope="table"
    >
      <a
        v-if="table.column.field === 'id'"
        href="#"
        @click.prevent="openInExplorer(table.row.id)"
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
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'

export default {
  name: 'WalletTransactions',

  components: {
    SvgIcon
  },

  data: () => ({
    transactions: []
  }),

  computed: {
    currentNetwork () {
      return this.$store.getters['session/currentNetwork']
    },

    columns () {
      return [
        {
          label: this.$t('WALLET_TRANSACTIONS.TRANSACTION_ID'),
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
          label: this.$t('WALLET_TRANSACTIONS.SENDER'),
          field: 'sender',
          formatFn: this.formatLongString
        },
        {
          label: this.$t('WALLET_TRANSACTIONS.RECIPIENT'),
          field: 'recipient',
          formatFn: this.formatLongString
        },
        {
          label: this.$t('WALLET_TRANSACTIONS.AMOUNT'),
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

    openInExplorer (id) {
      const url = `${this.currentNetwork.explorer}/transaction/${id}`
      this.electron_openExternal(url)
    }
  }
}
</script>
