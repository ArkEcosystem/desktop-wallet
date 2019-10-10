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
          source="url"
          @click="onInstallFrom"
        />
      </div>
    </div>

    <div
      class="PluginManager__banner"
      :style="{ backgroundImage: `url(${bannerImage})` }"
    >
      <div class="w-full lg:w-3/5 flex flex-col">
        <h1 class="PluginManager__banner__title">
          {{ $t('PAGES.PLUGIN_MANAGER.BANNER.TITLE') }}
        </h1>

        <h3>
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
            :disabled="!!query"
            class="pr-6 border-r border-theme-line-separator"
            @click="toggleMenu"
          />

          <PluginManagerButtonFilter
            :active-filter="activeFilter"
            :class="{ 'ml-6': !isMenuOpen }"
            @filter-change="onFilterChange"
          />

          <ButtonLayout
            :grid-layout="hasGridLayout"
            class="ml-2"
            @click="toggleLayout"
          />

          <ButtonReload
            :is-refreshing="isRefreshing"
            :title="$t('PAGES.PLUGIN_MANAGER.CLICK_TO_RELOAD')"
            :alternative-title="$t('PAGES.PLUGIN_MANAGER.RELOADING')"
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
            class="mt-10"
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
            path="PAGES.PLUGIN_MANAGER.NO_RESULTS"
          >
            <span
              class="inline-block font-bold"
              place="query"
            >
              {{ query }}
            </span>
          </i18n>

          <i18n
            v-else
            tag="span"
            class="text-center mt-4"
            path="PAGES.PLUGIN_MANAGER.EMPTY_CATEGORY"
          >
            <span
              class="inline-block font-bold"
              place="category"
            >
              {{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${activeCategory.toUpperCase()}`) }}
            </span>
          </i18n>
        </div>
      </div>
    </div>

    <PluginDetailsModal
      v-if="pluginToShow && !showPermissions"
      :plugin="pluginToShow"
      @close="closeDetailsModal"
      @remove="openRemovalModal"
      @show-permissions="toggleShowPermissions"
    />

    <PluginPermissionsModal
      v-if="(pluginToShow || pluginToInstall) && showPermissions"
      :plugin="pluginToShow || pluginToInstall"
      @install="openInstallModal"
      @close="toggleShowPermissions"
    />

    <PluginInstallModal
      v-if="pluginToInstall"
      :plugin="pluginToInstall"
      @download="onDownload"
      @install="onInstall"
      @close="closeInstallModal"
    />

    <PluginRemovalModal
      v-if="pluginToRemove"
      :plugin="pluginToRemove"
      @cancel="closeRemovalModal"
      @removed="onRemoved"
    />
  </div>
</template>

<script>
// import sortBy from 'lodash/sortBy'
import { ipcRenderer } from 'electron'
import { isEqual } from 'lodash'
import { ButtonLayout, ButtonReload } from '@/components/Button'
import {
  PluginDetailsModal,
  PluginInstallModal,
  PluginManagerGrid,
  PluginManagerSearchBar,
  PluginManagerSideMenu,
  PluginManagerTable,
  PluginPermissionsModal,
  PluginRemovalModal
} from '@/components/PluginManager'
import { PluginManagerButtonFilter, PluginManagerButtonInstallSource, PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons'

export default {
  name: 'PluginManager',

  components: {
    ButtonLayout,
    ButtonReload,
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
    PluginRemovalModal
  },

  data: () => ({
    activeCategory: 'all',
    activeFilter: 'all',
    isMenuOpen: false,
    isRefreshing: false,
    pluginToInstall: null,
    pluginToRemove: null,
    pluginToShow: null,
    query: null,
    showPermissions: false
  }),

  computed: {
    hasDarkTheme () {
      return this.session_hasDarkTheme
    },

    bannerImage () {
      const theme = this.hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/plugin-manager/banner-${theme}.svg`)
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

    plugins () {
      if (this.query) {
        return this.$store.getters['plugin/byQuery'](this.query, this.activeFilter)
      }

      return this.$store.getters['plugin/byCategory'](this.activeCategory, this.activeFilter)
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
    }
  },

  mounted () {
    ipcRenderer.on('plugin-manager:plugin-installed', async (_, pluginPath) => {
      await this.$plugins.fetchPlugin(pluginPath)

      this.openDetailsModal(this.pluginToInstall)
      this.closeInstallModal()
    })
  },

  methods: {
    async reloadPlugins () {
      this.isRefreshing = true

      try {
        await this.$plugins.fetchPlugins(true)
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'plugins',
          msg: error.message
        }))
      } finally {
        this.isRefreshing = false
      }
    },

    toggleLayout () {
      this.layout = this.layout === 'grid' ? 'tabular' : 'grid'
    },

    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    },

    openDetailsModal (plugin) {
      this.pluginToShow = plugin
    },

    closeDetailsModal () {
      this.pluginToShow = null
    },

    openRemovalModal (plugin) {
      if (this.pluginToShow) {
        this.pluginToShow = null
      }

      this.pluginToRemove = plugin
    },

    closeRemovalModal () {
      this.pluginToRemove = null
    },

    openInstallModal (plugin) {
      if (this.pluginToShow) {
        this.pluginToShow = null
      }

      this.showPermissions = false
      this.pluginToInstall = plugin
    },

    closeInstallModal () {
      this.pluginToInstall = null
    },

    toggleShowPermissions () {
      this.showPermissions = !this.showPermissions
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
      ipcRenderer.send('plugin-manager:install', this.pluginToInstall.id)
    },

    onRemoved (pluginId) {
      this.closeRemovalModal()
    },

    onSearch (query) {
      if (this.isMenuOpen) {
        this.toggleMenu()
      }

      this.query = query
    },

    onSortChange (sortParams) {
      if (!isEqual(sortParams, this.sortParams)) {
        this.sortParams = sortParams
      }
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
    },

    // TODO
    onInstallFrom (type) {
      console.log(`install from ${type}`)
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
  @apply flex items-center justify-end rounded-t-lg p-10 bg-left bg-no-repeat bg-theme-banner-background-color;
  background-size: auto 100%;
}
.PluginManager__banner__title {
  @apply text-theme-banner-text
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
