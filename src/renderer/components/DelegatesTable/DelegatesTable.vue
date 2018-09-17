<template>
  <vue-good-table
    :columns="columns"
    :rows="delegates"
    class="DelegatesTable"
  />
</template>

<script>
export default {
  name: 'DelegatesTable',

  data: () => ({
    delegates: []
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('DELEGATES_TABLE.RATE'),
          field: 'rate',
          type: 'Number'
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
      const api = this.$client.resource('delegates')

      try {
        const { data } = await api.all()
        const delegates = data.delegates || data
        this.delegates = delegates
      } catch (error) {
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
