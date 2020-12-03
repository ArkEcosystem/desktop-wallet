<template>
  <EntityTable
    ref="table"
    :columns="columns"
    :rows="delegatesRows"
    :transactions="rows"
    :pin-above="true"
    :is-remote="true"
    :is-loading="isLoading"
    v-on="$listeners"
  >
    <template slot-scope="{ data }">
      <div v-if="data.column.field === 'rank'">
        <span>#{{ getDelegateProperty(data.row.address, 'rank') }}</span>
      </div>

      <div
        v-if="data.column.field === 'status'"
        class="text-center"
      >
        <SvgIcon
          v-if="isDelegateActive(data.row.address)"
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

      <div v-if="data.column.field === 'forged'">
        <span class="font-semibold">{{ formatCurrency(getDelegateProperty(data.row.address, 'forged.total')) }}</span>
      </div>

      <div v-if="data.column.field === 'votes'">
        <span class="font-semibold">{{ formatCurrency(getDelegateProperty(data.row.address, 'votes')) }}</span>
      </div>
    </template>
  </EntityTable>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import EntityTable from './EntityTable'
import { get } from '@arkecosystem/utils'

export default {
  name: 'EntityTableDelegate',

  components: {
    EntityTable,
    SvgIcon
  },

  props: {
    rows: {
      type: Array,
      required: true
    },
    addresses: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data: () => ({
    isLoading: true,
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
          field: 'forged',
          thClass: 'no-sort',
          type: 'number',
          sortable: false
        },
        {
          label: this.$t('WALLET_DELEGATES.VOTES'),
          field: 'votes',
          thClass: 'no-sort',
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

    delegatesRows () {
      return Object.values(this.delegates)
    }
  },

  mounted () {
    this.fetchDelegates()
  },

  methods: {
    formatAddress (address) {
      return this.getDelegateProperty(address, 'username') || this.wallet_formatAddress(address, 16)
    },

    formatCurrency (value) {
      return this.formatter_networkCurrency(value)
    },

    async fetchDelegates () {
      if (!this.addresses.length) {
        return
      }

      this.isLoading = true

      try {
        const addresses = this.addresses.join(',')
        const { delegates } = await this.$client.fetchDelegates({ address: addresses })
        this.delegates = delegates.reduce((acc, item) => ({ ...acc, [item.address]: item }), {})
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'delegates',
          msg: error.message
        }))
        this.delegates = {}
      }

      this.isLoading = false
    },

    isDelegateActive (address) {
      const rank = this.getDelegateProperty(address, 'rank')
      return rank <= this.numberOfActiveDelegates
    },

    getDelegateProperty (address, path) {
      return get(this.delegates, `${address}.${path}`)
    }
  }
}
</script>
