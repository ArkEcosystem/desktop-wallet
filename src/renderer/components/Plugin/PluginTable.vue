<template>
  <div class="PluginTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="Plugins__table"
      :columns="columns"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'id'"
          class="flex"
        >
          <span class="flex items-center whitespace-no-wrap">
            {{ data.row.id | truncate(30) }} ({{ data.row.version }})
          </span>
        </div>
        <div
          v-else-if="data.column.field === 'name'"
          class="flex"
        >
          <span class="flex items-center whitespace-no-wrap">
            {{ data.row.name | truncate(30) }}
          </span>
        </div>

        <div
          v-else-if="data.column.field === 'description'"
          class="flex"
        >
          {{ data.row.description | truncate(50) }}
        </div>

        <div
          v-else-if="data.column.field === 'permissions'"
          class="flex"
        >
          {{ data.row.permissions && data.row.permissions.length ? data.row.permissions.join(', ') : $t('PLUGIN_TABLE.NO_PERMISSIONS') }}
        </div>

        <div
          v-else-if="data.column.field === 'isEnabled'"
          class="flex"
        >
          {{ data.row.isEnabled ? $t('PLUGIN_TABLE.ENABLED') : $t('PLUGIN_TABLE.DISABLED') }}
        </div>

        <div
          v-else-if="data.column.field === 'actions'"
          class="flex items-center justify-center"
        >
          <span
            v-tooltip="{
              content: data.row.isEnabled ? $t('PLUGIN_TABLE.DISABLE') : $t('PLUGIN_TABLE.ENABLE'),
              placement: 'left'
            }"
          >
            <button
              class="font-semibold flex text-xs hover:text-red text-theme-page-text-light p-1"
              @click="toggleStatus(data.row)"
            >
              <SvgIcon
                name="delete-wallet"
                view-box="0 0 16 16"
              />
            </button>
          </span>
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
import SvgIcon from '@/components/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'

export default {
  name: 'PluginTable',

  components: {
    SvgIcon,
    TableWrapper
  },

  computed: {
    columns () {
      const columns = [
        {
          label: this.$t('PLUGIN_TABLE.ID'),
          field: 'id'
        },
        {
          label: this.$t('PLUGIN_TABLE.NAME'),
          field: 'name'
        },
        {
          label: this.$t('PLUGIN_TABLE.DESCRIPTION'),
          field: 'description'
        },
        {
          label: this.$t('PLUGIN_TABLE.PERMISSIONS'),
          field: 'permissions',
          sortFn: this.sortByPermissions
        },
        {
          label: this.$t('PLUGIN_TABLE.STATUS'),
          field: 'isEnabled',
          type: 'boolean',
          thClass: 'text-left',
          tdClass: 'text-left'
        },
        {
          label: this.$t('PLUGIN_TABLE.ACTIONS'),
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

    sortByPermissions (x, y) {
      const values = []

      for (const perms of [x, y]) {
        values.push(perms ? perms.join(', ') : '')
      }

      return values[0].localeCompare(values[1], undefined, { sensitivity: 'base', numeric: true })
    },

    toggleStatus (plugin) {
      this.$emit('toggle', plugin)
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginTable tbody tr:hover {
  @apply .bg-theme-table-row-hover;
}
</style>
