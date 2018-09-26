<template>
  <vue-good-table
    :columns="columns"
    :rows="delegates"
    class="WalletDelegates"
  />
</template>

<script>
export default {
  name: 'WalletDelegates',

  data: () => ({
    delegates: []
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_DELEGATES.RATE'),
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
    }
  }
}
</script>
