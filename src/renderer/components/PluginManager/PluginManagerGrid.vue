<template>
  <div class="PluginManagerGrid mt-10">
    <div
      v-for="plugin in sortedPlugins"
      :key="plugin.id"
      class="PluginManagerGrid__plugin"
    >
      <div class="flex">
        <div class="flex flex-col">
          <PluginLogo :plugin="plugin" />

          <ButtonIconGeneric
            v-if="isInstalled(plugin.id) || isUpdateAvailable(plugin.id)"
            :icon="isUpdateAvailable(plugin.id) ? 'update-available' : 'details'"
            view-box="0 0 32 17"
            :is-small="true"
            class="w-full mt-2"
            @click="emitShowDetails(plugin)"
          />

          <ButtonGeneric
            v-else
            :label="$t('PAGES.PLUGIN_MANAGER.INSTALL')"
            :is-small="true"
            class="w-full mt-2"
            @click="emitShowDetails(plugin)"
          />
        </div>

        <div class="pl-4">
          <div class="flex flex-col justify-center h-20">
            <div class="flex items-center">
              <span
                class="PluginManagerGrid__plugin__name"
                @click="emitShowDetails(plugin)"
              >
                {{ plugin.title }}
              </span>
              <PluginManagerCheckmark v-if="plugin.isOfficial" />
              <PluginManagerGrants v-else-if="plugin.isGrant" />
            </div>
            <div class="PluginManagerGrid__plugin__details">
              <span>{{ plugin.author }}</span>
              <span class="ml-2">v{{ plugin.version }}</span>
              <span class="ml-2">{{ formatter_bytes(plugin.size) }}</span>
            </div>
          </div>

          <p class="leading-tight">
            {{ plugin.description | truncate(100) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import PluginManagerCheckmark from '@/components/PluginManager/PluginManagerCheckmark'
import PluginManagerGrants from '@/components/PluginManager/PluginManagerGrants'
import PluginLogo from '@/components/PluginManager/PluginLogo'

export default {
  name: 'PluginManagerGrid',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerCheckmark,
    PluginManagerGrants,
    PluginLogo
  },

  props: {
    plugins: {
      type: Array,
      required: true
    }
  },

  computed: {
    sortedPlugins () {
      return this.plugins.concat().sort((a, b) => a.title.localeCompare(b.title))
    }
  },

  methods: {
    emitShowDetails (plugin) {
      this.$emit('show-details', plugin)
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
.PluginManagerGrid {
  display: grid;
  grid-template-rows: 1fr;
  grid-column-gap: 2.5rem;
  grid-row-gap: 2.5rem;
}
.PluginManagerGrid__plugin {
  @apply pb-10 border-b border-dashed border-theme-line-separator;
}
.PluginManagerGrid__plugin:last-child {
  @apply pb-0 border-none;
}
.PluginManagerGrid__plugin__name {
  @apply text-theme-page-text font-semibold text-lg cursor-pointer;
}
.PluginManagerGrid__plugin__details {
  @apply flex items-center mt-1 text-theme-page-text-light;
}
.PluginManagerGrid__plugin__details span:not(:last-child) {
  @apply border-r pr-2 border-theme-line-separator;
}
@screen min-xl {
  .PluginManagerGrid {
    grid-template-columns: 1fr 1fr;
  }
  .PluginManagerGrid__plugin:nth-child(2n+1):nth-last-child(-n+2),
  .PluginManagerGrid__plugin:nth-child(2n+1):nth-last-child(-n+2) ~ .PluginManagerGrid__plugin {
    @apply pb-0 border-none;
  }
}
</style>
