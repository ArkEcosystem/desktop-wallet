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
          label: this.$t('DELEGATES_TABLE.RATE'),
          field: 'rate',
          type: 'number',
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          label: this.$t('DELEGATES_TABLE.USERNAME'),
          field: 'username',
          tdClass: 'w-2/3'
        },
        {
          label: this.$t('DELEGATES_TABLE.PRODUCTIVITY'),
          field: 'productivity',
          type: 'percentage',
          formatFn: this.formatPercentage
        },
        {
          label: this.$t('DELEGATES_TABLE.APPROVAL'),
          field: 'approval',
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
