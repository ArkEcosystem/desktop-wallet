<template>
  <div class="PluginManager">
    <div class="PluginManager__heading px-10 py-6 mb-3">
      <div class="flex flex-row w-full items-center">
        <h2 class="pr-8 border-r border-theme-line-separator">
          {{ $t('PAGES.PLUGIN_MANAGER.HEADER') }}
        </h2>

        <PluginManagerSearchBar
          class="ml-8 mr-auto"
          @search="onSearch"
        />

        <PluginManagerButtonInstallSource
          :is-disabled="!isAdvancedModeEnabled"
          source="url"
          @click="setModal('url')"
        />
      </div>
    </div>

    <div
      class="PluginManager__banner"
      :style="{
        backgroundImage: `url(${bannerImage})`,
        backgroundColor: colors.background
      }"
    >
      <div class="w-full lg:w-3/5 flex flex-col">
        <h1 :style="{ color: colors.title }">
          {{ $t('PAGES.PLUGIN_MANAGER.BANNER.TITLE') }}
        </h1>

        <h3 :style="{ color: colors.subtitle }">
          {{ $t('PAGES.PLUGIN_MANAGER.BANNER.SUBTITLE') }}
        </h3>
      </div>
    </div>

    <div class="PluginManager__wrapper">
      <PluginManagerSideMenu
        v-if="isMenuOpen"
        :active-category="activeCategory"
        @toggle="toggleMenu"
        @category-change="onCategoryChange"
      />

      <div class="PluginManager__body">
        <div class="flex items-center">
          <PluginManagerButtonMenu
            v-if="!isMenuOpen"
            :is-open="isMenuOpen"
            class="pr-6 border-r border-theme-line-separator"
            @click="toggleMenu"
          />

          <ButtonLayout
            :grid-layout="hasGridLayout"
            :class="{ 'ml-6': !isMenuOpen }"
            @click="toggleLayout"
          />

          <PluginManagerButtonFilter
            :active-filter="activeFilter"
            class="ml-2"
            @filter-change="onFilterChange"
          />

          <ButtonReload
            :is-refreshing="isRefreshing"
            :title="$t('PAGES.PLUGIN_MANAGER.CLICK_TO_RELOAD')"
            :without-background="true"
            tooltip-placement="left"
            class="ml-auto"
            @click="reloadPlugins"
          />
        </div>

        <template v-if="plugins.length">
          <PluginManagerGrid
            v-if="hasGridLayout"
            :plugins="plugins"
            @show-details="openDetailsModal"
          />

          <PluginManagerTable
            v-else
            :has-pagination="false"
            :rows="plugins"
            :total-rows="plugins.length"
            :sort-query="{
              field: sortParams.field,
              type: sortParams.type
            }"
            :no-data-message="$t('PLUGIN_TABLE.NO_PLUGINS')"
            :active-category="activeCategory"
            @on-sort-change="onSortChange"
            @show-details="openDetailsModal"
          />
        </template>

        <div
          v-else
          class="PluginManager__body__noresults"
        >
          <img
            :src="noResultsImage"
            class="PluginManager__body__noresults__image"
          >

          <i18n
            v-if="query"
            tag="span"
            class="text-center mt-4"
            path="PAGES.PLUGIN_MANAGER.NO_SEARCH_RESULTS"
          >
            <span
              slot="query"
              class="inline-block font-bold"
            >
              {{ query }}
            </span>
          </i18n>

          <i18n
            v-else
            tag="span"
            class="text-center mt-4"
            path="PAGES.PLUGIN_MANAGER.NO_RESULTS"
          >
            <span
              v-if="activeFilter !== 'all'"
              slot="filter"
            >
              {{ $t(`PAGES.PLUGIN_MANAGER.FILTERS.${activeFilter.toUpperCase()}`) }}
            </span>

            <span
              slot="category"
              class="inline-block font-bold"
            >
              {{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${activeCategory.toUpperCase()}`) }}
            </span>
          </i18n>
        </div>
      </div>
    </div>

    <PluginDetailsModal
      v-if="showDetailsModal"
      :plugin="selectedPlugin"
      @close="reset"
      @update="onUpdate"
      @remove="onRemove"
      @report="onReport"
      @change-status="onChangeStatus"
      @show-permissions="openPermissionsModal('details')"
    />

    <PluginPermissionsModal
      v-if="showPermissionsModal"
      :modal-ref="modalRef"
      :plugin="selectedPlugin"
      :is-update="isUpdate"
      @close="closePermissionsModal"
      @confirm="setModal('install')"
    />

    <PluginUrlModal
      v-if="showUrlModal"
      @close="resetModal"
      @fetch-plugin="fetchPluginData"
    />

    <PluginInstallModal
      v-if="showInstallModal"
      :plugin="selectedPlugin"
      :is-update="isUpdate"
      @close="reset"
      @download="onDownload"
      @install="onInstall"
    />

    <PluginRemovalModal
      v-if="showRemoveModal"
      :plugin="selectedPlugin"
      @cancel="reset"
      @confirm="removePlugin"
    />

    <PluginBlacklistModal
      v-if="showBlacklistModal"
      :plugin="selectedPlugin"
      @cancel="reset"
      @confirm="blacklistPlugin"
    />

    <ModalLoader
      :message="loadingModalText"
      :plugin="selectedPlugin"
      :visible="showLoadingModal"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { isEqual, sortBy, uniq } from 'lodash'
import { ButtonLayout, ButtonReload } from '@/components/Button'
import {
  PluginBlacklistModal,
  PluginDetailsModal,
  PluginInstallModal,
  PluginManagerGrid,
  PluginManagerSearchBar,
  PluginManagerSideMenu,
  PluginManagerTable,
  PluginPermissionsModal,
  PluginRemovalModal,
  PluginUrlModal
} from '@/components/PluginManager'
import { ModalLoader } from '@/components/Modal'
import {
  PluginManagerButtonFilter,
  PluginManagerButtonInstallSource,
  PluginManagerButtonMenu
} from '@/components/PluginManager/PluginManagerButtons'

export default {
  name: 'PluginManager',

  components: {
    ButtonLayout,
    ButtonReload,
    ModalLoader,
    PluginBlacklistModal,
    PluginDetailsModal,
    PluginInstallModal,
    PluginManagerButtonFilter,
    PluginManagerButtonInstallSource,
    PluginManagerButtonMenu,
    PluginManagerGrid,
    PluginManagerSearchBar,
    PluginManagerSideMenu,
    PluginManagerTable,
    PluginPermissionsModal,
    PluginRemovalModal,
    PluginUrlModal
  },

  data: () => ({
    activeCategory: 'all',
    activeFilter: 'all',
    isBlacklisting: false,
    isRefreshing: false,
    isUpdate: false,
    isRemoving: false,
    modalRef: null,
    selectedPlugin: null,
    modal: '',
    query: null
  }),

  computed: {
    installSuccessMessage () {
      return this.$t(
        `PAGES.PLUGIN_MANAGER.SUCCESS.${this.isUpdate ? 'UPDATE' : 'INSTALLATION'}`, {
          plugin: this.selectedPlugin.title
        }
      )
    },

    installErrorMessage () {
      return this.$t('PAGES.PLUGIN_MANAGER.ERRORS.FETCH', {
        plugin: this.selectedPlugin.title
      })
    },

    showDetailsModal () {
      return !!this.selectedPlugin && this.modal === 'details'
    },

    showInstallModal () {
      return !!this.selectedPlugin && this.modal === 'install'
    },

    showUrlModal () {
      return this.modal === 'url'
    },

    showRemoveModal () {
      return !!this.selectedPlugin && this.modal === 'remove'
    },

    showBlacklistModal () {
      return !!this.selectedPlugin && this.modal === 'blacklist'
    },

    showLoadingModal () {
      return this.modal === 'loading'
    },

    showPermissionsModal () {
      return !!this.selectedPlugin && this.modal === 'permissions'
    },

    hasDarkTheme () {
      return this.session_hasDarkTheme
    },

    bannerImage () {
      const theme = this.hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/plugin-manager/banner-${theme}.svg`)
    },

    colors () {
      const themeColors = {
        dark: {
          background: '#585d6d',
          title: '#f7f9fb',
          subtitle: '#787fa3'
        },
        light: {
          background: '#e7f9fd',
          title: '#1d6ddb',
          subtitle: '#2b3748'
        }
      }

      let colors = themeColors[this.theme]

      if (!colors) {
        let mode = 'light'
        const pluginTheme = this.$store.getters['plugin/themes'][this.theme]
        if (pluginTheme) {
          mode = pluginTheme.darkMode ? 'dark' : 'light'
        }
        colors = themeColors[mode]
      }

      return colors
    },

    isAdvancedModeEnabled () {
      return this.$store.getters['session/isAdvancedModeEnabled']
    },

    theme () {
      return this.$store.getters['session/theme']
    },

    noResultsImage () {
      const theme = this.hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/plugin-manager/noresults-${theme}.svg`)
    },

    hasGridLayout () {
      return this.layout === 'grid'
    },

    layout: {
      get () {
        return this.$store.getters['session/pluginManagerLayout']
      },
      set (layout) {
        this.$store.dispatch('session/setPluginManagerLayout', layout)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          pluginManagerLayout: layout
        })
      }
    },

    isMenuOpen: {
      get () {
        return this.$store.getters['session/pluginMenuOpen']
      },
      set (open) {
        this.$store.dispatch('session/setPluginMenuOpen', open)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          pluginMenuOpen: open
        })
      }
    },

    plugins () {
      const plugins = this.$store.getters['plugin/filtered'](this.query, this.activeCategory, this.activeFilter)

      return sortBy(plugins.map(plugin => plugin.config), 'title')
    },

    sortParams: {
      get () {
        return this.$store.getters['session/pluginSortParams']
      },
      set (sortParams) {
        this.$store.dispatch('session/setPluginSortParams', sortParams)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          pluginSortParams: sortParams
        })
      }
    },

    loadingModalText () {
      if (!this.selectedPlugin) {
        return ''
      }

      const type = this.isRemoving ? 'REMOVING' : this.isBlacklisting ? 'BLACKLISTING' : this.isUpdate ? 'UPDATING' : 'INSTALLING'

      return this.$t(`PAGES.PLUGIN_MANAGER.${type}`, {
        plugin: this.selectedPlugin.title
      })
    }
  },

  mounted () {
    ipcRenderer.on('plugin-manager:plugin-installed', this.onPluginInstalled)
    ipcRenderer.on('plugin-manager:error', this.onError)
  },

  beforeDestroy () {
    ipcRenderer.removeListener('plugin-manager:plugin-installed', this.onPluginInstalled)
    ipcRenderer.removeListener('plugin-manager:error', this.onError)
  },

  methods: {
    async removePlugin (removeOptions) {
      this.isRemoving = true
      this.setModal('loading')

      await this.$store.dispatch('plugin/deletePlugin', {
        pluginId: this.selectedPlugin.id,
        removeOptions
      })

      this.$success(this.$t('PAGES.PLUGIN_MANAGER.SUCCESS.REMOVE', {
        plugin: this.selectedPlugin.title
      }))

      this.reset()
    },

    async blacklistPlugin () {
      this.isBlacklisting = true
      this.setModal('loading')

      for (const profile of this.$store.getters['profile/all']) {
        if (this.$store.getters['plugin/isEnabled'](this.selectedPlugin.id, profile.id)) {
          await this.disablePlugin(this.selectedPlugin.id, profile.id)
        }
      }

      this.$store.dispatch('plugin/setBlacklisted', {
        scope: 'local',
        plugins: uniq([...this.$store.getters['plugin/blacklisted'].local, this.selectedPlugin.id])
      })

      this.$success(this.$t('PAGES.PLUGIN_MANAGER.SUCCESS.BLACKLIST', {
        plugin: this.selectedPlugin.title
      }))

      this.reset()
    },

    async reloadPlugins () {
      this.isRefreshing = true

      try {
        await this.$plugins.fetchPlugins(true)
        this.$success(this.$t('PAGES.PLUGIN_MANAGER.SUCCESS.RELOAD'))
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'plugins',
          msg: error.message
        }))
      } finally {
        this.isRefreshing = false
      }
    },

    setModal (modal) {
      this.modal = modal
    },

    resetModal () {
      this.modal = null
    },

    resetIsUpdate () {
      if (this.isUpdate) {
        this.isUpdate = false
      }
    },

    setPlugin (plugin) {
      this.selectedPlugin = plugin
    },

    resetPlugin () {
      this.selectedPlugin = null
    },

    toggleLayout () {
      this.layout = this.layout === 'grid' ? 'tabular' : 'grid'
    },

    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    },

    openDetailsModal (plugin) {
      this.setPlugin(plugin)
      this.setModal('details')
    },

    openPermissionsModal (ref = '') {
      this.modalRef = ref
      this.setModal('permissions')
    },

    closePermissionsModal (ref) {
      if (ref) {
        this.setModal(ref)
      } else {
        this.resetModal()
      }

      this.resetIsUpdate()
    },

    reset () {
      this.resetPlugin()
      this.resetModal()
      this.resetIsUpdate()
      this.isBlacklisting = false
      this.isRemoving = false
    },

    async fetchPluginData (url) {
      try {
        const plugin = await this.$plugins.fetchPluginFromUrl(url)

        if (this.$store.getters['plugin/isInstalled'](plugin.id)) {
          this.$error(this.$t('PAGES.PLUGIN_MANAGER.ERRORS.ALREADY_INSTALLED', {
            plugin: plugin.id
          }))
          this.resetModal()
        } else {
          this.openDetailsModal(plugin)
        }
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'plugin',
          msg: error.message
        }))
        this.resetModal()
      }
    },

    onCategoryChange (category) {
      this.activeCategory = category
    },

    onFilterChange (filter) {
      this.activeFilter = filter
    },

    onDownload (source) {
      ipcRenderer.send('plugin-manager:download', {
        url: source
      })
    },

    onInstall () {
      this.setModal('loading')

      const installedPlugin = this.$store.getters['plugin/installedById'](this.selectedPlugin.id)

      ipcRenderer.send('plugin-manager:install', {
        pluginId: this.selectedPlugin.id,
        pluginPath: installedPlugin ? installedPlugin.fullPath : null
      })
    },

    onUpdate () {
      this.isUpdate = true
      this.openPermissionsModal('details')
    },

    onRemove () {
      this.setModal('remove')
    },

    onReport () {
      this.setModal('blacklist')
    },

    onSearch (query) {
      this.query = query
    },

    onSortChange (sortParams) {
      if (!isEqual(sortParams, this.sortParams)) {
        this.sortParams = sortParams
      }
    },

    async onPluginInstalled (_, pluginPath) {
      try {
        await this.$plugins.fetchPlugin(pluginPath, this.isUpdate)

        if (this.isUpdate) {
          for (const profile of this.$store.getters['profile/all']) {
            if (this.$store.getters['plugin/isEnabled'](this.selectedPlugin.id, profile.id)) {
              await this.disablePlugin(this.selectedPlugin.id, profile.id)
              await this.enablePlugin(this.selectedPlugin.id, profile.id)
            }
          }
        } else {
          await this.enablePlugin(this.selectedPlugin.id, this.session_profile.id)
        }

        this.$success(this.installSuccessMessage)
      } catch (error) {
        this.$error(this.installErrorMessage)
      } finally {
        this.reset()
      }
    },

    onError (_, error) {
      this.reset()
      this.$error(error)
    },

    async onChangeStatus (enabled, pluginId) {
      await this.updateStatus({ enabled, pluginId })
    },

    async disablePlugin (pluginId, profileId) {
      await this.updateStatus({ enabled: false, pluginId, profileId })
    },

    async enablePlugin (pluginId, profileId) {
      await this.updateStatus({ enabled: true, pluginId, profileId })
    },

    async updateStatus ({ enabled, pluginId, profileId = null }) {
      try {
        await this.$store.dispatch('plugin/setEnabled', {
          enabled,
          pluginId,
          profileId
        })
      } catch (error) {
        this.$error(this.$t(`PAGES.PLUGIN_MANAGER.ERRORS.${enabled ? 'ENABLE' : 'DISABLE'}`, {
          plugin: pluginId,
          error: error.message
        }))
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManager {
  @apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.Plugins__avatar__sign {
  @apply rounded-full w-8 h-8 flex justify-center items-center text-base absolute pin-b pin-r mr-3 -mb-1 border-2 border-theme-feature font-semibold select-none whitespace-no-wrap
}
.PluginManager__heading {
  @apply .flex .justify-between .items-center .bg-theme-feature .rounded-lg;
}
.PluginManager__banner {
  @apply flex items-center justify-end rounded-t-lg p-10 bg-left bg-no-repeat;
  background-size: auto 100%;
}
.PluginManager__wrapper {
  @apply flex flex-1 bg-theme-feature rounded-b-lg overflow-y-hidden
}
.PluginManager__body {
  @apply flex flex-1 flex-col p-10 overflow-y-auto
}
.PluginManager__body__noresults {
  @apply flex flex-col justify-center items-center h-full
}
.PluginManager__body__noresults__image {
  @apply h-1/2 max-w-xs min-w-48
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
