<template>
  <div class="TransactionTable w-full">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :row-style-class="formatRow"
      :no-data-message="$t('TABLE.NO_TRANSACTIONS')"
      v-on="$listeners"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div v-if="data.column.field === 'id' && data.row.confirmations > 0">
          <a
            class="flex items-center whitespace-no-wrap"
            href="#"
            @click.stop="network_openExplorer('transaction', data.row.id)"
          >
            <SvgIcon
              v-show="isDashboard"
              v-tooltip="{
                content: data.row.vendorField,
                classes: 'max-w-xs break-words text-justify text-xs',
                trigger: 'hover',
                container: '.TransactionTable'
              }"
              :name="data.formattedRow['vendorField'] ? 'vendorfield' : 'vendorfield-empty'"
              view-box="0 0 18 18"
              class="mr-2"
            />

            <span
              v-tooltip="{
                content: data.row.id,
                classes: 'text-xs',
                trigger: 'hover',
                container: '.TransactionTable'
              }"
              class="mr-1"
            >
              {{ data.formattedRow['id'] }}
            </span>

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
              content: `${$t('TRANSACTION.AMOUNT')}: ${formatAmount(data.row, false)}<br>${$t('TRANSACTION.FEE')}: ${formatFee(data.row.fee)}`,
              html: true,
              classes: 'leading-loose',
              trigger: 'hover',
              container: '.TransactionTable',
              placement: 'left'
            }"
            class="font-bold mr-2 whitespace-no-wrap"
          >
            {{ data.row.isSender ? '-' : '+' }}
            {{ formatAmount(data.row) }}
          </span>
          <TransactionStatusIcon
            v-bind="data.row"
            :show-tooltip="true"
            tooltip-container=".TransactionTable"
          />
        </div>

        <div
          v-else-if="data.column.field === 'senderPublicKey'"
          :class="[ isDashboard ? 'dashboard-address' : 'max-w-xxs' ]"
        >
          <WalletAddress
            :address="data.row.sender"
            :address-length="8"
            tooltip-container=".TransactionTable"
          />
        </div>

        <div
          v-else-if="data.column.field === 'recipientId'"
          :class="[ isDashboard ? 'dashboard-address' : 'max-w-xxs' ]"
        >
          <WalletAddress
            :address="data.row.recipient"
            :address-length="8"
            :type="data.row.type"
            :group="data.row.typeGroup"
            :asset="data.row.asset"
            tooltip-container=".TransactionTable"
          />
        </div>

        <div
          v-else-if="data.column.field === 'asset.ipfs'"
          :class="{ 'dashboard-address': isDashboard }"
        >
          <a
            class="flex items-center justify-end whitespace-no-wrap"
            href="#"
            @click.stop="electron_openExternal(getIpfsUrl(data.row))"
          >
            <span class="hidden md:inline">
              {{ data.formattedRow[data.column.field] }}
            </span>
            <span class="inline md:hidden">
              {{ data.formattedRow[data.column.field] | truncateMiddle(20) }}
            </span>

            <SvgIcon
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light ml-1"
            />
          </a>
        </div>

        <span
          v-else
          :class="{ 'word-break-all': data.column.field === 'vendorField' }"
        >
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
import { TRANSACTION_TYPES } from '@config'
import SvgIcon from '@/components/SvgIcon'
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShow, TransactionStatusIcon } from '@/components/Transaction'
import WalletAddress from '@/components/Wallet/WalletAddress'
import TableWrapper from '@/components/utils/TableWrapper'
import TransactionService from '@/services/transaction'

export default {
  name: 'TransactionTable',

  components: {
    SvgIcon,
    TableWrapper,
    TransactionShow,
    TransactionStatusIcon,
    WalletAddress
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
      const vendorFieldClass = [
        'hidden', 'w-1/4'
      ]
      if (this.hasShortId && !this.isDashboard) {
        vendorFieldClass.push('xxl:table-cell')
      } else if (!this.isDashboard) {
        vendorFieldClass.push('xl:table-cell')
      }

      const columns = [
        {
          label: this.$t('TRANSACTION.ID'),
          field: 'id',
          formatFn: this.formatTransactionId,
          sortable: false,
          thClass: 'no-sort'
        },
        {
          label: this.$t('COMMON.DATE'),
          field: 'timestamp',
          type: 'date',
          formatFn: this.formatDate,
          tdClass: 'text-center',
          thClass: 'text-center'
        }
      ]

      if (this.transactionType === TRANSACTION_TYPES.GROUP_1.IPFS) {
        columns.push({
          label: this.$t('TRANSACTION.HASH'),
          field: 'asset.ipfs',
          tdClass: 'text-right md:w-3/5',
          thClass: 'no-sort text-right md:w-3/5',
          sortable: false
        })
      } else {
        columns.push(...[
          {
            label: this.$t('TRANSACTION.SENDER'),
            field: 'senderPublicKey',
            sortable: false,
            thClass: 'no-sort'
          },
          {
            label: this.$t('TRANSACTION.RECIPIENT'),
            field: 'recipientId',
            sortable: false,
            thClass: 'no-sort'
          },
          {
            label: this.$t('TRANSACTION.VENDOR_FIELD'),
            field: 'vendorField',
            formatFn: this.formatSmartbridge,
            tdClass: vendorFieldClass.join(' '),
            thClass: vendorFieldClass.join(' ')
          },
          {
            label: this.$t('TRANSACTION.AMOUNT'),
            type: 'number',
            field: 'amount',
            tdClass: 'text-right',
            thClass: 'text-right'
          }
        ])
      }

      return columns
    }
  },

  methods: {
    formatDate (value) {
      return this.formatter_date(value)
    },

    formatAddress (value) {
      return this.wallet_formatAddress(value, 10)
    },

    formatTransactionId (value) {
      return this.hasShortId ? truncateMiddle(value, 6) : truncateMiddle(value, 10)
    },

    formatSmartbridge (value) {
      if (value.length > 43) {
        return `${value.slice(0, 40)}...`
      }
      return value
    },

    formatAmount (row, includeFee = true) {
      return this.formatter_networkCurrency(TransactionService.getAmount(this, row, this.wallet_fromRoute, includeFee))
    },

    formatFee (value) {
      return this.formatter_networkCurrency(value)
    },

    formatRow (row) {
      const classes = [
        row.confirmations === 0 ? 'unconfirmed' : 'confirmed'
      ]

      if (row.isExpired) {
        classes.push('expired')
      }

      return classes.join(' ')
    },

    getIpfsUrl (row) {
      return `https://cloudflare-ipfs.com/ipfs/${row.asset.ipfs}`
    },

    openTransactions (id) {
      this.network_openExplorer('transaction', id)
    },

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

<style lang="postcss">
.TransactionTable tr.unconfirmed {
  @apply opacity-50 text-theme-page-text;
}
.TransactionTable tr.unconfirmed .Transaction__confirmations {
  @apply text-theme-page-text bg-theme-page-instructions-background;
}
.TransactionTable tr.expired {
  @apply line-through;
}
.TransactionTable td .dashboard-address {
  width: 100px;
}
</style>
