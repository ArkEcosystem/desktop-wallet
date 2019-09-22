<template>
  <div class="PluginManagerGrid mt-10">
    <div
      v-for="plugin in plugins"
      :key="plugin.id"
      class="PluginManagerGrid__plugin"
    >
      <div class="flex">
        <div class="flex flex-col">
          <PluginLogo :plugin="plugin" />

          <ButtonGeneric
            :label="$t('PAGES.PLUGIN_MANAGER.DETAILS')"
            :is-small="true"
            class="w-full mt-2"
            @click="emitShowDetails(plugin)"
          />
        </div>

        <div class="pl-4">
          <div class="flex flex-col justify-center h-20">
            <span class="text-theme-page-text font-semibold text-lg">
              {{ plugin.title }}
            </span>

            <div class="PluginManagerGrid__plugin__details">
              <div
                v-if="plugin.isOfficial"
                class="PluginManager__checkmark"
              >
                <SvgIcon
                  name="checkmark"
                  view-box="0 0 6 6"
                />
              </div>

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
import { ButtonGeneric } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import PluginLogo from '@/components/PluginManager/PluginLogo'

export default {
  name: 'PluginManagerGrid',

  components: {
    ButtonGeneric,
    PluginLogo,
    SvgIcon
  },

  props: {
    plugins: {
      type: Array,
      required: true
    }
  },

  methods: {
    emitShowDetails (plugin) {
      this.$emit('show-details', plugin)
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
  @apply pb-10 border-b border-dashed;
}
.PluginManagerGrid__plugin:last-child {
  @apply pb-0 border-none;
}
.PluginManagerGrid__plugin__details {
  @apply flex items-center mt-1 text-theme-page-text-light;
}
.PluginManagerGrid__plugin__details span:not(:last-child) {
  @apply border-r pr-2
}
@screen min-lg {
  .PluginManagerGrid {
    grid-template-columns: 1fr 1fr;
  }
  .PluginManagerGrid__plugin:nth-child(2n+1):nth-last-child(-n+2),
  .PluginManagerGrid__plugin:nth-child(2n+1):nth-last-child(-n+2) ~ .PluginManagerGrid__plugin {
    @apply pb-0 border-none;
  }
}
</style>
