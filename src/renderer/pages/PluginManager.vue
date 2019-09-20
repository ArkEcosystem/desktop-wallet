<template>
  <div class="PluginManager">
    <div class="PluginManager__heading px-10 py-6 mb-3">
      <div class="flex flex-row w-full items-center">
        <h2 class="pr-8 border-r">
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
      :style="`backgroundImage: url('${assets_loadImage(background)}')`"
    >
      <div class="w-3/5 flex flex-col">
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
            class="pr-6 border-r"
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

        <PluginManagerGrid
          v-if="hasGridLayout"
          :plugins="plugins"
          @show-details="toggleDetailsModal"
        />

        <PluginManagerTable
          v-else
          :has-pagination="false"
          :rows="plugins"
          :total-rows="plugins.length"
          :sort-query="sortParams"
          :no-data-message="$t('PLUGIN_TABLE.NO_PLUGINS')"
          class="mt-10"
          @on-sort-change="onSortChange"
          @show-details="toggleDetailsModal"
        />

        <Pagination
          v-if="showPagination"
          :meta="meta"
          :current-page="currentPage"
          @page-change="onPageChange"
        />
      </div>
    </div>

    <PluginDetailsModal
      v-if="showDetailsModal"
      :plugin="selectedPlugin"
      :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
      container-classes="max-w-md"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
// import sortBy from 'lodash/sortBy'
import { ButtonLayout, ButtonReload } from '@/components/Button'
import { Pagination } from '@/components/Pagination'
import {
  PluginDetailsModal,
  PluginManagerGrid,
  PluginManagerSearchBar,
  PluginManagerSideMenu,
  PluginManagerTable
} from '@/components/PluginManager'
import { PluginManagerButtonInstallSource, PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons'

export default {
  name: 'Plugins',

  components: {
    ButtonLayout,
    ButtonReload,
    Pagination,
    PluginDetailsModal,
    PluginManagerGrid,
    PluginManagerSearchBar,
    PluginManagerSideMenu,
    PluginManagerTable,
    PluginManagerButtonInstallSource,
    PluginManagerButtonMenu
  },

  data: () => ({
    isRefreshing: false,
    currentPage: 1,
    pluginToConfirm: null,
    isMenuOpen: false,
    activeCategory: 'all',
    showDetailsModal: false,
    selectedPlugin: null
  }),

  computed: {
    background () {
      return 'pages/plugin-manager/banner.svg'
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

    allPlugins () {
      return this.$store.getters['plugin/all']
    },

    plugins () {
      return this.$store.getters['plugin/all']
    },

    showPagination () {
      return false
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

    // OLD

    // plugins () {
    //   const plugins = []
    //   const availablePlugins = this.$store.getters['plugin/available']
    //   for (const pluginData of Object.values(availablePlugins)) {
    //     plugins.push({
    //       id: pluginData.config.id,
    //       version: pluginData.config.version,
    //       name: pluginData.config.name,
    //       description: pluginData.config.description,
    //       permissions: pluginData.config.permissions,
    //       isEnabled: this.$store.getters['plugin/isEnabled'](pluginData.config.id)
    //     })
    //   }

    //   return sortBy(plugins, ['id'])
    // },
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

    toggleDetailsModal (plugin) {
      this.selectedPlugin = plugin
      this.showDetailsModal = true
    },

    closeDetailsModal () {
      this.selectedPlugin = null
      this.showDetailsModal = false
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
      this.sortParams = sortParams
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
  @apply flex items-center justify-end rounded-t-lg py-10 bg-left-bottom bg-no-repeat;
  background-color: #e7f9fd
}
.PluginManager__banner__title {
  /* TODO: colors */
  color: #1d6ddb;
}
.PluginManager__wrapper {
  @apply flex flex-1 bg-theme-feature rounded-b-lg overflow-y-hidden
}
.PluginManager__body {
  @apply flex flex-1 flex-col p-10 overflow-y-auto
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
  @apply flex items-center justify-center text-white mr-1 rounded-full w-3 h-3;
  background-color: #007cff;
}
</style>
