<template>
  <div class="PluginTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="PluginManagerTable"
      :columns="columns"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'logo'"
        >
          <PluginLogo
            :plugin="data.row"
            :size="40"
          />
        </div>

        <div
          v-else-if="data.column.field === 'name'"
          class="flex"
        >
          <span class="flex items-center whitespace-no-wrap">
            {{ data.row.title | truncate(30) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'author'"
          class="flex items-center"
        >
          <div
            v-if="data.row.isOfficial"
            class="PluginManager__checkmark"
          >
            <SvgIcon
              name="checkmark"
              view-box="0 0 6 7"
            />
          </div>

          <span class="flex items-center whitespace-no-wrap">
            {{ data.row.author | truncate(30) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'category'"
          class="flex"
        >
          <span>{{ strings_capitalizeFirst(data.row.categories[0]) }}</span>
        </div>

        <div
          v-else-if="data.column.field === 'size'"
          class="flex"
        >
          <span class="whitespace-no-wrap">
            {{ formatter_bytes(data.row.size) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'actions'"
          class="flex items-center justify-center"
        >
          <ButtonGeneric
            :label="$t('PAGES.PLUGIN_MANAGER.DETAILS')"
            :is-small="true"
            @click="emitShowDetails(data.row)"
          />
        </div>

        <span
          v-else
        >
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>
  </div>
</template>

<script>
import { ButtonGeneric } from '@/components/Button'
import PluginLogo from '@/components/PluginManager/PluginLogo'
import SvgIcon from '@/components/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'PluginManagerTable',

  components: {
    ButtonGeneric,
    PluginLogo,
    SvgIcon,
    TableWrapper
  },

  computed: {
    columns () {
      const columns = [
        {
          label: '',
          field: 'logo',
          sortable: false
        },
        {
          label: this.$t('PLUGIN_TABLE.NAME'),
          field: 'name',
          thClass: 'w-full',
          tdClass: 'w-full'
        },
        {
          label: this.$t('PLUGIN_TABLE.AUTHOR'),
          field: 'author'
        },
        {
          label: this.$t('PLUGIN_TABLE.CATEGORY'),
          field: 'category',
          sortFn: this.sortByCategories
        },
        {
          label: this.$t('PLUGIN_TABLE.SIZE'),
          field: 'size',
          type: 'number'
        },
        {
          label: this.$t('PLUGIN_TABLE.VERSION'),
          field: 'version'
        },
        {
          label: '',
          field: 'actions',
          sortable: false,
          thClass: 'text-center not-sortable',
          tdClass: 'text-center'
        }
      ]

      return columns
    }
  },

  methods: {
    onSortChange (sortOptions) {
      this.$emit('on-sort-change', sortOptions[0])
    },

    toggleStatus (plugin) {
      this.$emit('toggle', plugin)
    },

    emitShowDetails (plugin) {
      this.$emit('show-details', plugin)
    },

    sortByCategories (x, y, col, rowX, rowY) {
      return rowX.categories[0].localeCompare(rowY.categories[0], undefined, { sensitivity: 'base', numeric: true })
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerTable tbody tr:hover {
  @apply .bg-theme-table-row-hover;
}

.PluginManagerTable .vgt-table tr > td:not(:first-child):not(:last-child),
.PluginManagerTable .vgt-table tr > th:not(:first-child):not(:last-child) {
  @apply pr-10
}

.PluginManagerTable .vgt-table tr > td:first-child {
  @apply pl-5
}

.PluginManagerTable .vgt-table tr > td:last-child {
  @apply pr-5
}
</style>
