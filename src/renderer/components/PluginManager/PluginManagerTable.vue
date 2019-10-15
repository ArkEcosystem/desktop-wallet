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
          v-else-if="data.column.field === 'title'"
        >
          <span class="whitespace-no-wrap">
            {{ data.row.title | truncate(30) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'author'"
          class="flex items-center"
        >
          <PluginManagerCheckmark v-if="data.row.isOfficial" />

          <span class="flex items-center whitespace-no-wrap">
            {{ data.row.author | truncate(30) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'categories'"
        >
          <span>{{ getCategory(data.row) }}</span>
        </div>

        <div
          v-else-if="data.column.field === 'size'"
        >
          <span class="whitespace-no-wrap">
            {{ formatter_bytes(data.row.size) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'actions'"
          class="flex items-center justify-center"
        >
          <ButtonIconGeneric
            v-if="isUpdateAvailable(data.row.id)"
            icon="update-available"
            view-box="0 0 32 17"
            :is-small="true"
            class="w-full"
            @click="emitShowDetails(data.row)"
          />

          <ButtonGeneric
            v-else
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
import { ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import PluginManagerCheckmark from '@/components/PluginManager/PluginManagerCheckmark'
import PluginLogo from '@/components/PluginManager/PluginLogo'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'PluginManagerTable',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerCheckmark,
    PluginLogo,
    TableWrapper
  },

  props: {
    activeCategory: {
      type: String,
      required: true
    }
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
          field: 'title',
          thClass: 'w-full',
          tdClass: 'w-full'
        },
        {
          label: this.$t('PLUGIN_TABLE.AUTHOR'),
          field: 'author'
        },
        {
          label: this.$t('PLUGIN_TABLE.CATEGORY'),
          field: 'categories',
          sortFn: this.sortByCategories
        },
        {
          label: this.$t('PLUGIN_TABLE.VERSION'),
          field: 'version'
        },
        {
          label: this.$t('PLUGIN_TABLE.SIZE'),
          field: 'size',
          type: 'number'
        },
        {
          label: '',
          field: 'actions',
          sortable: false,
          thClass: 'text-center not-sortable',
          tdClass: 'text-center'
        }
      ]

      if (this.activeCategory !== 'all') {
        const index = columns.findIndex(el => {
          return el.field === 'categories'
        })
        columns.splice(index, 1)
      }

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

    getCategory (row) {
      return this.$t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${row.categories[0].toUpperCase()}`)
    },

    sortByCategories (x, y, col, rowX, rowY) {
      const a = this.getCategory(rowX)
      const b = this.getCategory(rowY)

      return a.localeCompare(b)
    },

    isUpdateAvailable (pluginId) {
      return this.$store.getters['plugin/isUpdateAvailable'](pluginId)
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
