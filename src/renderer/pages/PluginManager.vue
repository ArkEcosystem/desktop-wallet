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
          v-for="type of ['url', 'file']"
          :key="type"
          :source="type"
          @install-from="onInstallFrom"
        />
      </div>
    </div>

    <div
      class="PluginManager__banner"
      :style="{ backgroundImage: `url('${bannerImage}')` }"
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
            class="pr-6 border-r border-theme-line-separator"
            @click="toggleMenu"
          />

          <ButtonLayout
            :grid-layout="hasGridLayout"
            :class="{ 'pl-6': !isMenuOpen }"
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
            tag="span"
            class="text-center mt-4"
            path="PAGES.PLUGIN_MANAGER.EMPTY_CATEGORY"
          >
            <strong place="category">
              {{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${activeCategory.toUpperCase()}`) }}
            </strong>
          </i18n>
        </div>
      </div>
    </div>

    <PluginDetailsModal
      v-if="pluginToShow"
      :plugin="pluginToShow"
      :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
      container-classes="max-w-md"
      @close="closeDetailsModal"
      @install="onInstall"
      @remove="openRemovalModal"
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
import { isEqual } from 'lodash'
import { ButtonLayout, ButtonReload } from '@/components/Button'
import {
  PluginDetailsModal,
  PluginManagerGrid,
  PluginManagerSearchBar,
  PluginManagerSideMenu,
  PluginManagerTable,
  PluginRemovalModal
} from '@/components/PluginManager'
import { PluginManagerButtonInstallSource, PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons'

export default {
  name: 'Plugins',

  components: {
    ButtonLayout,
    ButtonReload,
    PluginDetailsModal,
    PluginManagerGrid,
    PluginManagerSearchBar,
    PluginManagerSideMenu,
    PluginManagerTable,
    PluginManagerButtonInstallSource,
    PluginManagerButtonMenu,
    PluginRemovalModal
  },

  data: () => ({
    isRefreshing: false,
    currentPage: 1,
    pluginToConfirm: null,
    isMenuOpen: false,
    activeCategory: 'all',
    pluginToShow: null,
    pluginToRemove: null
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
      return this.$store.getters['plugin/byCategory'](this.activeCategory)
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

  methods: {
    async reloadPlugins () {
      this.isRefreshing = true

      await this.$plugins.fetchPlugins(true)

      this.isRefreshing = false
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

    onCategoryChange (category) {
      this.activeCategory = category
    },

    onPageChange (page) {
      console.log('page-change: %s', page)
    },

    onSearch (query) {
      // TODO: filter plugins, i.e. match query against name, author and description
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

    onRemoved (pluginId) {
      this.closeRemovalModal()
    },

    async onInstall (pluginId) {
      try {
        await this.$plugins.installPlugin(pluginId)
      } catch (error) {
        this.$error(`Could not install '${pluginId}: ${error.message}`)
      }
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

<style lang="postcss">
.PluginManager__checkmark {
  @apply flex items-center justify-center text-white mr-1 rounded-full w-3 h-3 bg-blue
}
</style>
