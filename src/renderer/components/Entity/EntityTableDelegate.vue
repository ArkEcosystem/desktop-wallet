<template>
  <EntityTable
    ref="table"
    :columns="columns"
    :rows="rows"
    :entity-type="$options.delegateType"
    :pin-above="true"
    v-on="$listeners"
  >
    <template slot-scope="{ data }">
      <div v-if="data.column.field === 'rank'">
        <span>#{{ data.row.rank }}</span>
      </div>

      <div
        v-if="data.column.field === 'status'"
        class="text-center"
      >
        <SvgIcon
          v-if="isDelegateActive(data.row.rank)"
          v-tooltip="{
            content: $t('WALLET_DELEGATES.STATUS.ACTIVE')
          }"
          name="status-active"
          view-box="0 0 20 20"
          class="text-green-dark focus:outline-none"
        />
        <SvgIcon
          v-else
          v-tooltip="{
            content: $t('WALLET_DELEGATES.STATUS.STANDBY')
          }"
          name="status-standby"
          view-box="0 0 20 20"
          class="text-theme-page-text-light focus:outline-none"
        />
      </div>

      <div v-if="data.column.field === 'forged.total'">
        <span class="font-semibold">{{ data.formattedRow['forged.total'] }}</span>
      </div>

      <div v-if="data.column.field === 'votes'">
        <span class="font-semibold">{{ data.formattedRow['votes'] }}</span>
      </div>
    </template>
  </EntityTable>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import SvgIcon from '@/components/SvgIcon'
import EntityTable from './EntityTable'
import { get } from '@arkecosystem/utils'

export default {
  name: 'EntityTableDelegate',

  delegateType: TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE,

  components: {
    EntityTable,
    SvgIcon
  },

  data: () => ({
    delegates: {}
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_DELEGATES.USERNAME'),
          field: 'address',
          formatFn: this.formatAddress,
          tdClass: 'md:w-1/4'
        },
        {
          label: this.$t('WALLET_DELEGATES.RANK'),
          field: 'rank'
        },
        {
          label: 'MSQ',
          field: 'msq',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: this.$t('WALLET_DELEGATES.STATUS.TITLE'),
          field: 'status',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: this.$t('WALLET_DELEGATES.FORGED'),
          field: 'forged.total',
          thClass: 'no-sort',
          formatFn: this.formatCurrency,
          type: 'number',
          sortable: false
        },
        {
          label: this.$t('WALLET_DELEGATES.VOTES'),
          field: 'votes',
          thClass: 'no-sort',
          formatFn: this.formatCurrency,
          type: 'number',
          sortable: false
        },
        {
          label: '',
          field: 'action',
          thClass: 'no-sort',
          sortable: false
        }
      ]
    },

    numberOfActiveDelegates () {
      return get(this, 'session_network.constants.activeDelegates') || 51
    },

    rows () {
      return Object.values(this.$store.getters['delegate/bySessionProfile'])
    }
  },

  methods: {
    formatAddress (address) {
      return this.rows.find(item => item.address === address).username
    },

    formatCurrency (value) {
      return this.formatter_networkCurrency(value)
    },

    isDelegateActive (rank) {
      return rank <= this.numberOfActiveDelegates
    }
  }
}
</script>
