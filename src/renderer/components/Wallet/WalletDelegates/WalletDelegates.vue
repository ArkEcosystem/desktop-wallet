<template>
  <div class="WalletDelegates">
    <vue-good-table
      :columns="columns"
      :rows="delegates"
      class="WalletDelegates"
      @on-row-click="onRowClick"
    >
      <template
        slot="table-row"
        slot-scope="table"
      >
        <div
          v-if="table.column.field === 'username'"
        >
          <div class="flex items-center">
            <span>{{ table.formattedRow['username'] }}</span>
            <span
              v-if="table.row.publicKey === votePublicKey"
              class="WalletDelegates__vote-badge bg-red-light text-white p-1 text-xs rounded pointer-events-none ml-3"
            >
              {{ $t('WALLET_DELEGATES.VOTE') }}
            </span>
          </div>
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
      <TransactionModal
        :title="selected.username"
        :type="3"
        :delegate="selected"
        :is-voter="selected.publicKey === votePublicKey"
        @cancel="onCancel"
        @sent="onSent"
      />
    </portal>
  </div>
</template>

<script>
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletDelegates',

  components: {
    TransactionModal
  },

  data: () => ({
    delegates: [],
    votePublicKey: null,
    selected: null
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_DELEGATES.RANK'),
          field: 'rank',
          type: 'number',
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          label: this.$t('WALLET_DELEGATES.USERNAME'),
          field: 'username',
          tdClass: 'w-2/3'
        },
        {
          label: this.$t('WALLET_DELEGATES.PRODUCTIVITY'),
          field: 'production.productivity',
          type: 'percentage',
          formatFn: this.formatPercentage
        },
        {
          label: this.$t('WALLET_DELEGATES.APPROVAL'),
          field: 'production.approval',
          type: 'percentage',
          formatFn: this.formatPercentage
        }
      ]
    }
  },

  mounted () {
    this.fetchDelegates()
    this.fetchWalletVote()
  },

  methods: {
    async fetchDelegates () {
      try {
        this.delegates = await this.$client.fetchDelegates()
      } catch (error) {
        console.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'delegates',
          msg: error.message
        }))
      }
    },

    async fetchWalletVote () {
      try {
        this.votePublicKey = await this.$client.fetchWalletVote(this.wallet_fromRoute.address)
      } catch (error) {
        console.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'fetch vote',
          msg: error.message
        }))
      }
    },

    formatPercentage (value) {
      return this.formatter_percentage(value)
    },

    onRowClick ({ row }) {
      this.selected = row
    },

    onSent () {
      this.votePublicKey = null
    },

    onCancel () {
      this.selected = null
    }
  }
}
</script>

<style scoped>
.WalletDelegates__vote-badge {
  opacity: 0.85
}
</style>
