<template>
  <div class="WalletTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="WalletAll__table"
      :columns="columns"
      v-on="$listeners"
      @on-cell-click="onCellClick"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'address'"
          class="flex items-center"
        >
          <RouterLink
            :to="{ name: 'wallet-show', params: { address: data.row.address } }"
            class="flex flex-row mr-4"
          >
            <WalletIdenticon
              :value="data.row.address"
              :size="40"
              class="identicon cursor-pointer"
            />
          </RouterLink>

          <RouterLink :to="{ name: 'wallet-show', params: { address: data.row.address } }">
            {{ data.formattedRow['address'] }}
          </RouterLink>
        </div>

        <div
          v-else-if="data.column.field === 'name'"
        >
          <span class="flex items-center whitespace-no-wrap">
            {{ walletName(data.row) | truncate(30) }}
            <span
              v-if="data.row.isLedger"
              class="WalletTable__ledger-badge bg-red-light text-white p-1 text-xs font-bold rounded pointer-events-none"
              :class="{ 'ml-3': walletName(data.row) }"
            >
              {{ $t('WALLET_TABLE.LEDGER') }}
            </span>
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'balance'"
        >
          <span>
            {{ formatter_networkCurrency(data.row.balance) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'votedDelegate'"
        >
          {{ data.row.votedDelegate ? data.row.votedDelegate.username : '' }}
        </div>

        <div
          v-else-if="data.column.field === 'delete'"
          class="flex items-center justify-center"
        >
          <button
            :disabled="data.row.isLedger"
            class="font-semibold flex text-xs cursor-pointer hover:text-red text-theme-page-text-light p-1"
            @click="removeRow(data.row)"
          >
            <SvgIcon
              name="delete-wallet"
              view-box="0 0 16 16"
            />
          </button>
        </div>

        <span
          v-else
        >
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'
import { WalletIdenticon } from '@/components/Wallet'

export default {
  name: 'WalletTable',

  components: {
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

  props: {
    isContactsTable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    columns () {
      let columns = [
        {
          // label: this.$t('WALLET_DELEGATES.RANK'),
          label: this.$t('PAGES.WALLET_ALL.ADDRESS'),
          field: 'address'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.NAME'),
          field: 'name',
          sortFn: this.sortByName
        },
        {
          label: this.$t('PAGES.WALLET_ALL.VOTING_FOR'),
          field: this.delegateName,
          thClass: 'w-full whitespace-no-wrap',
          tdClass: 'w-full'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.BALANCE'),
          field: 'balance',
          type: 'number',
          tdClass: 'font-bold whitespace-no-wrap'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.DELETE'),
          field: 'delete',
          sortable: false,
          thClass: 'text-center'
        }
      ]

      if (this.isContactsTable) {
        const index = columns.findIndex(el => {
          return el.field === 'balance'
        })
        columns.splice(index, 1)
      }

      return columns
    }
  },

  methods: {
    removeRow (row) {
      this.$emit('remove-row', row)
    },

    sortByName (x, y, col, rowX, rowY) {
      const one = this.wallet_name(rowX.address) || ''
      const two = this.wallet_name(rowY.address) || ''

      return (one < two ? -1 : one > two ? 1 : 0)
    },

    delegateName (row) {
      return row.votedDelegate ? row.votedDelegate.username : ''
    },

    walletName (row) {
      return row.name || this.wallet_name(row.address)
    },

    onCellClick ({ row, column }) {
      if (column.field !== 'delete') {
        this.$router.push({ name: 'wallet-show', params: { address: row.address } })
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletTable tr:hover {
  @apply .bg-theme-table-row-hover .cursor-pointer;
}
.WalletTable tr:hover .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.WalletTable .identicon {
  transition: 0.5s;
}
.WalletTable__ledger-badge {
  opacity: 0.85
}
</style>
