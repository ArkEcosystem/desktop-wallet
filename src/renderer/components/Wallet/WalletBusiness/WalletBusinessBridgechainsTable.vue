<template>
  <div class="WalletBusinessBridgechainsTable w-full">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :no-data-message="$t('WALLET_BUSINESS.NO_TRANSACTIONS')"
      v-on="$listeners"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
    />

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
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShow } from '@/components/Transaction'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'WalletBusinessBridgechainsTable',

  components: {
    TableWrapper,
    TransactionShow
  },

  props: {
    hasShortId: {
      type: Boolean,
      required: false,
      default: false
    },

    isDashboard: {
      type: Boolean,
      required: false,
      default: false
    },

    transactionType: {
      type: Number,
      required: false,
      default: null
    }
  },

  data: () => ({
    selected: null
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_BUSINESS.COLUMN.ID'),
          field: 'bridgechainId'
        }, {
          label: this.$t('WALLET_BUSINESS.COLUMN.NAME'),
          field: 'name'
        }, {
          label: this.$t('WALLET_BUSINESS.COLUMN.SEEDS'),
          field: 'seedNodes',
          formatFn: value => {
            return value.length
          }
        }, {
          label: this.$t('WALLET_BUSINESS.COLUMN.GENESIS_HASH'),
          field: 'genesisHash',
          formatFn: value => {
            return truncateMiddle(value, 5)
          }
        }, {
          label: this.$t('WALLET_BUSINESS.COLUMN.REPO'),
          field: 'bridgechainRepository'
        }
      ]
    }
  },

  methods: {
    onSortChange (sortOptions) {
      this.$emit('on-sort-change', {
        source: 'transactionsTab',
        ...sortOptions[0]
      })
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
