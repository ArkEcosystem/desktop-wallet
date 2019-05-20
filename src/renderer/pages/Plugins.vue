<template>
  <div class="Plugins">
    <div class="Plugins__heading px-8 py-6 mb-3">
      <div class="flex flex-row items-center">
        <h2>{{ $t('PAGES.PLUGINS.HEADER') }}</h2>
      </div>

      <div class="flex flex-row items-center">
        <a
          class="font-bold text-center cursor-pointer pr-6 border-r border-theme-feature-item-alternative"
          @click="discover"
        >
          <span class="rounded-full bg-theme-button h-8 w-8 mb-3 mx-auto flex items-center justify-center">
            <SvgIcon
              name="world"
              class="text-center"
              view-box="0 0 9 9"
            />
          </span>

          {{ $t('PAGES.PLUGINS.DISCOVER') }}
        </a>
        <a
          class="font-bold text-center cursor-pointer px-6 border-r border-theme-feature-item-alternative"
          @click="open"
        >
          <span class="rounded-full bg-theme-button h-8 w-8 mb-3 mx-auto flex items-center justify-center">
            <SvgIcon
              name="search"
              class="text-center"
              view-box="0 0 9 9"
            />
          </span>

          {{ $t('PAGES.PLUGINS.OPEN') }}
        </a>
        <a
          class="font-bold text-center cursor-pointer pl-6"
          @click="refresh"
        >
          <span class="rounded-full bg-theme-button h-8 w-8 mb-3 mx-auto flex items-center justify-center">
            <SvgIcon
              name="update"
              class="text-center"
              view-box="0 0 9 9"
            />
          </span>

          {{ $t('PAGES.PLUGINS.RELOAD') }}
        </a>
      </div>
    </div>

    <div class="Plugins__body">
      <PluginTable
        :has-pagination="false"
        :is-contacts-table="true"
        :rows="plugins"
        :total-rows="plugins.length"
        :sort-query="sortParams"
        :no-data-message="$t('PLUGIN_TABLE.NO_PLUGINS')"
        @reorder="onReorder"
        @toggle="onToggleStatus"
      />
    </div>

    <PluginEnableConfirmation
      v-if="pluginToConfirm"
      :plugin="pluginToConfirm"
      @close="closeEnableConfirmation"
      @ignore="closeEnableConfirmation"
      @enable="enablePlugin"
    />
  </div>
</template>

<script>
import electron from 'electron'
import { clone, some, sortBy } from 'lodash'
import { PLUGINS } from '@config'
import { PluginEnableConfirmation, PluginTable } from '@/components/Plugin'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'Plugins',

  components: {
    PluginEnableConfirmation,
    PluginTable,
    SvgIcon
  },

  data: () => ({
    pluginToConfirm: null
  }),

  computed: {
    plugins () {
      const plugins = []
      const availablePlugins = this.$store.getters['plugin/available']
      for (const pluginData of Object.values(availablePlugins)) {
        plugins.push({
          id: pluginData.config.id,
          version: pluginData.config.version,
          name: pluginData.config.name,
          description: pluginData.config.description,
          permissions: pluginData.config.permissions,
          isEnabled: this.$store.getters['plugin/isEnabled'](pluginData.config.id)
        })
      }

      return sortBy(plugins, ['id'])
    },

    sortParams: {
      get () {
        return this.$store.getters['session/contactSortParams']
      },
      set (sortParams) {
        this.$store.dispatch('session/setContactSortParams', sortParams)
        const profile = clone(this.session_profile)
        profile.contactSortParams = sortParams
        this.$store.dispatch('profile/update', profile)
      }
    },

    showVotedDelegates () {
      return some(this.plugins, contact => contact.hasOwnProperty('votedDelegate'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('contacts')
    })
  },

  methods: {
    onReorder (sortParams) {
      this.sortParams = sortParams
    },

    onToggleStatus (plugin) {
      if (!plugin.isEnabled) {
        this.pluginToConfirm = plugin
      } else {
        this.disablePlugin(plugin)
      }
    },

    closeEnableConfirmation () {
      this.pluginToConfirm = null
    },

    discover () {
      this.electron_openExternal(PLUGINS.discoverUrl)
    },
    open () {
      electron.shell.openItem(PLUGINS.path)
    },
    refresh () {
      this.electron_reload()
    },

    disablePlugin (plugin) {
      this.updateStatus({ pluginId: plugin.id, enabled: false })
    },
    enablePlugin (plugin) {
      this.updateStatus({ pluginId: plugin.id, enabled: true })
      this.closeEnableConfirmation()
    },

    updateStatus ({ pluginId, enabled }) {
      this.$store.dispatch('plugin/setEnabled', {
        enabled,
        pluginId
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
.Plugins {
  @apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.Plugins__avatar__sign {
  @apply rounded-full w-8 h-8 flex justify-center items-center text-base absolute pin-b pin-r mr-3 -mb-1 border-2 border-theme-feature font-semibold select-none whitespace-no-wrap
}
.Plugins__heading {
  @apply .flex .justify-between .items-center .bg-theme-feature .rounded-lg;
}
.Plugins__body {
  @apply flex flex-1 bg-theme-feature rounded-lg p-10 overflow-y-auto
}
</style>
