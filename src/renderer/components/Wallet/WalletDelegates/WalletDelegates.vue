<template>
  <div class="WalletDelegates">
    <vue-good-table
      :columns="columns"
      :rows="delegates"
      class="WalletDelegates"
      @on-row-click="onRowClick"
    />
    <portal
      v-if="selected"
      to="modal"
    >
      <TransactionModal
        :title="selected.username"
        :type="3"
        :delegate="selected"
        @cancel="onCancel"
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

    formatPercentage (value) {
      return `${value}%`
    },

    onRowClick ({ row }) {
      this.selected = row
    },

    onCancel () {
      this.selected = null
    }
  }
}
</script>
