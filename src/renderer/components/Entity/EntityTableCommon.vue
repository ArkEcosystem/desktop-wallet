<template>
  <EntityTable
    ref="table"
    :columns="columns"
    :rows="rows"
    :entity-type="entityType"
    v-on="$listeners"
  />
</template>

<script>
import EntityTable from './EntityTable'

export default {
  name: 'EntityTableCommon',

  components: {
    EntityTable
  },

  props: {
    entityType: {
      type: Number,
      required: true
    }
  },

  computed: {
    rows () {
      return Object.values(this.$store.getters['entity/byEntityType'](this.entityType))
    },
    columns () {
      return [
        {
          label: this.$t('COMMON.ADDRESS'),
          field: 'address',
          formatFn: this.formatAddress,
          thClass: '',
          tdClass: 'md:w-1/4'
        },
        {
          label: this.$t('ENTITY.NAME'),
          field: 'data.name',
          tdClass: 'md:w-1/3'
        },
        {
          label: this.$t('ENTITY.HISTORY'),
          field: 'history',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: this.$t('ENTITY.WEBSITE'),
          field: 'website',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: 'MSQ',
          field: 'msq',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: '',
          field: 'action',
          thClass: 'flex items-end justify-end no-sort',
          sortable: false
        }
      ]
    }
  },

  methods: {
    formatAddress (address) {
      return this.wallet_formatAddress(address, 16)
    }
  }
}
</script>
