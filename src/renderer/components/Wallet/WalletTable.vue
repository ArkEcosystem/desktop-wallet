<template>
  <div class="WalletTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="WalletAll__table"
      :columns="columns"
      @on-cell-click="onCellClick"
      @on-sort-change="onSortChange"
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
          class="flex"
        >
          <span
            class="flex items-center whitespace-no-wrap"
            :class="{ 'text-theme-page-text-light': !data.row.name }"
          >
            <span
              v-tooltip="{
                content: !data.row.name ? $t('COMMON.NETWORK_NAME') : '',
                placement: 'right'
              }"
              :class="{ 'pr-1': walletName(data.row) }"
            >
              {{ walletName(data.row) | truncate(30) }}
            </span>
            <span
              v-if="data.row.isLedger"
              class="ledger-badge"
              :class="{ 'ml-0': !walletName(data.row) }"
            >
              {{ $t('COMMON.LEDGER') }}
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
          v-else-if="data.column.field === 'actions'"
          class="flex items-center justify-center"
        >
          <span class="ml-1">
            <ButtonClipboard
              :value="data.row.address"
              view-box="0 0 16 16"
              :subject="$t('COMMON.ADDRESS').toLowerCase()"
              class="hover:text-red text-theme-page-text-light p-1"
            />
          </span>

          <span>
            <button
              v-tooltip="$t('WALLET_TABLE.RENAME')"
              class="font-semibold flex text-xs hover:text-red text-theme-page-text-light p-1"
              @click="renameRow(data.row)"
            >
              <SvgIcon
                name="name"
                view-box="0 0 16 16"
              />
            </button>
          </span>

          <span
            v-tooltip="data.row.isLedger ? $t('WALLET_TABLE.NO_DELETE') : $t('WALLET_TABLE.DELETE')"
            class="mr-1"
          >
            <button
              class="font-semibold flex text-xs hover:text-red text-theme-page-text-light p-1"
              :class="disabled"
              :disabled="data.row.isLedger"
              @click="removeRow(data.row)"
            >
              <SvgIcon
                name="delete-wallet"
                view-box="0 0 16 16"
              />
            </button>
          </span>
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
import { ButtonClipboard } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'
import { WalletIdenticon } from '@/components/Wallet'

export default {
  name: 'WalletTable',

  components: {
    ButtonClipboard,
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

  props: {
    showVotedDelegates: {
      type: Boolean,
      default: false,
      required: false
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
          sortFn: this.sortByName,
          thClass: !this.showVotedDelegates ? 'w-full' : '',
          tdClass: !this.showVotedDelegates ? 'w-full' : ''
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
          label: this.$t('WALLET_TABLE.ACTIONS'),
          field: 'actions',
          sortable: false,
          thClass: 'text-center not-sortable',
          tdClass: 'text-center'
        }
      ]

      if (!this.showVotedDelegates) {
        const index = columns.findIndex(el => {
          return el.field === this.delegateName
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

    renameRow (row) {
      this.$emit('rename-row', row)
    },

    sortByName (x, y, col, rowX, rowY) {
      let one = this.wallet_name(rowX.address) || ''
      let two = this.wallet_name(rowY.address) || ''

      if (!isNaN(one)) {
        one = one.padStart(10, 0)
      }

      if (!isNaN(two)) {
        two = two.padStart(10, 0)
      }

      return (one < two ? -1 : one > two ? 1 : 0)
    },

    delegateName (row) {
      return row.votedDelegate ? row.votedDelegate.username : ''
    },

    walletName (row) {
      return row.name || this.wallet_name(row.address)
    },

    onCellClick ({ row, column }) {
      if (column.field !== 'actions') {
        this.$router.push({ name: 'wallet-show', params: { address: row.address } })
      }
    },

    onSortChange (sortOptions) {
      this.$emit('on-sort-change', sortOptions[0])
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletTable tbody tr:hover {
  @apply .bg-theme-table-row-hover .cursor-pointer;
}
.WalletTable tbody tr:hover .identicon {
  opacity: 1;
}
.WalletTable .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.WalletTable button {
  transition: color 0.2s;
}
.WalletTable button.disabled {
  opacity: 0.5;
}
</style>
