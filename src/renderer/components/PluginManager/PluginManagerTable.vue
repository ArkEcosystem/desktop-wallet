<template>
  <div class="w-full mt-8">
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
          class="flex items-center"
        >
          <span
            class="whitespace-no-wrap cursor-pointer"
            @click="emitShowDetails(data.row)"
          >
            {{ data.row.title | truncate(30) }}
          </span>
          <PluginManagerCheckmark v-if="data.row.isOfficial" />
          <PluginManagerGrants v-else-if="data.row.isGrant" />
        </div>

        <div
          v-else-if="data.column.field === 'author'"
          class="flex items-center"
        >
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
          v-else-if="data.column.field === 'status'"
          class="flex items-center"
        >
          <img
            v-tooltip="{
              content: $t(`PLUGIN_TABLE.${getStatusText(data.row.id).toUpperCase()}`),
              placement: 'left'
            }"
            :src="getStatusIcon(data.row.id)"
            width="33"
            class="px-1 mx-auto"
          >
        </div>

        <div
          v-else-if="data.column.field === 'actions'"
          class="flex items-center justify-center"
        >
          <ButtonIconGeneric
            v-if="isInstalled(data.row.id) || isUpdateAvailable(data.row.id)"
            :icon="isUpdateAvailable(data.row.id) ? 'update-available' : 'details'"
            view-box="0 0 32 17"
            :is-small="true"
            class="w-full"
            @click="emitShowDetails(data.row)"
          />

          <ButtonGeneric
            v-else
            :label="$t('PAGES.PLUGIN_MANAGER.INSTALL')"
            :is-small="true"
            class="w-full"
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
import PluginManagerGrants from '@/components/PluginManager/PluginManagerGrants'
import PluginLogo from '@/components/PluginManager/PluginLogo'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'PluginManagerTable',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerCheckmark,
    PluginManagerGrants,
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
          label: this.$t('PLUGIN_TABLE.STATUS'),
          field: 'status',
          sortFn: this.sortByStatus,
          thClass: 'text-center',
          tdClass: 'text-center'
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
        const index = columns.findIndex(el => el.field === 'categories')
        columns.splice(index, 1)
      }

      return columns
    }
  },

  methods: {
    onSortChange (sortOptions) {
      this.$emit('on-sort-change', sortOptions[0])
    },

    emitShowDetails (plugin) {
      this.$emit('show-details', plugin)
    },

    getCategory (row) {
      return this.$t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${row.categories[0].toUpperCase()}`)
    },

    getStatusIcon (pluginId) {
      return this.assets_loadImage(`pages/plugin-manager/status/plugin-${this.getStatusText(pluginId)}.svg`)
    },

    getStatusText (pluginId) {
      if (this.isInstalled(pluginId)) {
        return this.isEnabled(pluginId) ? 'enabled' : 'disabled'
      }

      return 'available'
    },

    sortByCategories (x, y, col, rowX, rowY) {
      const a = this.getCategory(rowX)
      const b = this.getCategory(rowY)

      return a.localeCompare(b)
    },

    sortByStatus (x, y, col, rowX, rowY) {
      const aInstalled = this.isInstalled(rowX.id)
      const bInstalled = this.isInstalled(rowY.id)

      const aEnabled = this.isEnabled(rowX.id)
      const bEnabled = this.isEnabled(rowY.id)

      return (aInstalled === bInstalled) ? (!!aEnabled === !!bEnabled) ? 0 : aEnabled ? -1 : 1 : aInstalled ? -1 : 1
    },

    isEnabled (pluginId) {
      return this.$store.getters['plugin/isEnabled'](pluginId)
    },

    isInstalled (pluginId) {
      return this.$store.getters['plugin/isInstalled'](pluginId)
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
