<template>
  <div class="WalletBusinessBridgechainsTable w-full">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :no-data-message="$t('WALLET_BUSINESS.NO_TRANSACTIONS')"
      v-on="$listeners"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div v-if="data.column.field === 'name'">
          <span>{{ data.formattedRow[data.column.field] }}</span>

          <span
            v-if="!!data.row.isResigned"
            class="font-bold"
          >
            - {{ $t('WALLET_BUSINESS.BRIDGECHAIN.RESIGNED') }}
          </span>
        </div>

        <div v-else-if="data.column.field === 'bridgechainRepository'">
          <a
            class="flex items-center whitespace-no-wrap"
            href="#"
            @click.stop="electron_openExternal(data.row.bridgechainRepository)"
          >
            <span
              v-tooltip="{
                content: data.row.bridgechainRepository,
                classes: 'text-xs',
                trigger: 'hover',
                container: '.TransactionTable'
              }"
              class="mr-1"
            >
              {{ data.formattedRow.bridgechainRepository }}
            </span>

            <SvgIcon
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light"
            />
          </a>
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
      <WalletBusinessShowBridgechain
        :bridgechain="selected"
        @close="onCloseModal"
      />
    </Portal>
  </div>
</template>

<script>
import truncateMiddle from '@/filters/truncate-middle'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import WalletBusinessShowBridgechain from './WalletBusinessShowBridgechain'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'WalletBusinessBridgechainsTable',

  components: {
    SvgIcon,
    TableWrapper,
    WalletBusinessShowBridgechain
  },

  data: () => ({
    selected: null
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_BUSINESS.COLUMN.NAME'),
          field: 'name'
        },
        {
          label: this.$t('WALLET_BUSINESS.COLUMN.SEEDS'),
          field: 'seedNodes',
          formatFn: value => {
            return value.length
          }
        },
        {
          label: this.$t('WALLET_BUSINESS.COLUMN.GENESIS_HASH'),
          field: 'genesisHash',
          formatFn: value => {
            return truncateMiddle(value, 14)
          }
        },
        {
          label: this.$t('WALLET_BUSINESS.COLUMN.REPOSITORY'),
          field: 'bridgechainRepository'
        }
      ]
    }
  },

  methods: {
    onSortChange (sortOptions) {
      this.$emit('on-sort-change', {
        source: 'bridgechainsTab',
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
