<template>
  <div class="TransactionMultiSignatureTable w-full">
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
        <div
          v-if="data.column.field === 'amount'"
          class="flex items-center justify-end"
        >
          <span
            v-tooltip="{
              content: `${$t('TRANSACTION.AMOUNT')}: ${formatAmount(data.row, false)}<br>${$t('TRANSACTION.FEE')}: ${formatFee(data.row.fee)}`,
              html: true,
              classes: 'leading-loose',
              trigger: 'hover',
              container: '.TransactionMultiSignatureTable',
              placement: 'left'
            }"
            class="font-bold mr-2 whitespace-no-wrap"
          >
            {{ data.row.isSender ? '-' : '+' }}
            {{ formatAmount(data.row) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'senderPublicKey'"
          class="max-w-xxs"
        >
          <WalletAddress
            :address="formatAddress(data.row)"
            :address-length="8"
            tooltip-container=".TransactionMultiSignatureTable"
          />
        </div>

        <div
          v-else-if="data.column.field === 'recipientId'"
          class="max-w-xxs"
        >
          <WalletAddress
            :address="data.row.recipient || data.row.recipientId"
            :address-length="8"
            :type="data.row.type"
            :group="data.row.typeGroup"
            :asset="data.row.asset"
            tooltip-container=".TransactionMultiSignatureTable"
          />
        </div>

        <div
          v-else-if="data.column.field === 'status'"
          class="max-w-xxs"
        >
          <span
            v-if="needsWalletSignature(data.row)"
            class="text-red"
          >
            {{ $t('TRANSACTION.MULTI_SIGNATURE.YOUR_SIGNATURE') }}
          </span>

          <span
            v-else-if="needsSignatures(data.row)"
            class="text-red"
          >
            {{ $t('TRANSACTION.MULTI_SIGNATURE.N_MORE', [remainingSignatureCount(data.row)]) }}
          </span>

          <span
            v-else
            class="text-green"
          >
            {{ $t('TRANSACTION.MULTI_SIGNATURE.READY') }}
          </span>
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
      <TransactionShowMultiSignature
        :transaction="selected"
        @close="onCloseModal"
      />
    </Portal>
  </div>
</template>

<script>
import truncateMiddle from '@/filters/truncate-middle'
import { TransactionShowMultiSignature } from '@/components/Transaction'
import WalletAddress from '@/components/Wallet/WalletAddress'
import TableWrapper from '@/components/utils/TableWrapper'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionMultiSignatureTable',

  components: {
    TableWrapper,
    TransactionShowMultiSignature,
    WalletAddress
  },

  props: {
    hasShortId: {
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
          label: this.$t('TRANSACTION.ID'),
          field: 'id',
          formatFn: this.formatTransactionId,
          sortable: false
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
          field: 'senderPublicKey',
          sortable: false
        },
        {
          label: this.$t('TRANSACTION.RECIPIENT'),
          field: 'recipientId',
          sortable: false
        },
        {
          label: this.$t('TRANSACTION.STATUS'),
          field: 'status'
        },
        {
          label: this.$t('TRANSACTION.AMOUNT'),
          type: 'number',
          field: 'amount',
          tdClass: 'text-right',
          thClass: 'text-right'
        }
      ]
    }
  },

  methods: {
    needsSignatures (transaction) {
      return TransactionService.needsSignatures(transaction)
    },

    needsWalletSignature (transaction) {
      return TransactionService.needsWalletSignature(transaction, WalletService.getPublicKeyFromWallet(this.wallet_fromRoute))
    },

    remainingSignatureCount (transaction) {
      let min = transaction.multiSignature.min
      if (TransactionService.isMultiSignatureRegistration(transaction)) {
        min = transaction.multiSignature.publicKeys.length
      }

      return min - transaction.signatures.length
    },

    formatDate (value) {
      return this.formatter_date(value)
    },

    formatAddress (row) {
      return row.sender || WalletService.getAddressFromPublicKey(row.senderPublicKey, this.session_network.version)
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

    formatHash (value) {
      return truncateMiddle(value, 10)
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
.TransactionMultiSignatureTable tr.unconfirmed {
  @apply opacity-50 text-theme-page-text;
}
.TransactionMultiSignatureTable tr.unconfirmed .Transaction__confirmations {
  @apply text-theme-page-text bg-theme-page-instructions-background;
}
.TransactionMultiSignatureTable tr.expired {
  @apply line-through;
}
.TransactionMultiSignatureTable td .dashboard-address {
  width: 100px;
}
</style>
