import { VueGoodTable } from 'vue-good-table'
import Loader from './Loader'

export default {
  name: 'TableWrapper',

  props: {
    currentPage: {
      type: Number,
      required: false,
      default: 1
    },
    hasPagination: {
      type: Boolean,
      required: false,
      default: false
    },
    perPage: {
      type: Number,
      required: false,
      default: 10
    },
    perPageDropdown: {
      type: Array,
      required: false,
      default: () => [10, 20, 30, 40, 50]
    },
    isRemote: {
      type: Boolean,
      required: false,
      default: false
    },
    sortQuery: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  render (h) {
    return h(VueGoodTable, {
      props: {
        mode: this.isRemote ? 'remote' : 'local',
        sortOptions: {
          enabled: !!this.sortQuery,
          initialSortBy: this.sortQuery
        },
        paginationOptions: {
          enabled: this.hasPagination,
          dropdownAllowAll: false,
          perPage: this.perPage,
          perPageDropdown: this.perPageDropdown,
          nextLabel: this.$t('COMMON.NEXT'),
          prevLabel: this.$t('COMMON.PREV'),
          rowsPerPageLabel: this.$t('TABLE.ROWS_PER_PAGE'),
          ofLabel: this.$t('COMMON.OF'),
          pageLabel: this.$t('TABLE.PAGE'),
          allLabel: this.$t('COMMON.ALL')
        },
        ...this.$attrs
      },
      scopedSlots: {
        'table-row': table => this.$scopedSlots.default({ ...table })
      },
      on: this.$listeners
    }, [
      h('div', {
        slot: 'loadingContent',
        class: 'flex justify-center p-5'
      }, [
        h(Loader)
      ])
    ])
  }

}
