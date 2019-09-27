<template>
  <PluginManagerModalWindow
    portal-target="plugin"
    :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    container-classes="max-w-md"
    @close="emitClose"
  >
    <template #header>
      <PluginLogo
        :plugin="plugin"
        :size="120"
      />

      <div class="flex flex-col ml-5 justify-between">
        <div>
          <span class="text-theme-page-text font-semibold text-xl">
            {{ plugin.title }}
          </span>

          <span
            class="PluginDetailsModal__header__details"
          >
            <div
              v-if="plugin.isOfficial"
              class="PluginManager__checkmark"
            >
              <SvgIcon
                name="checkmark"
                view-box="0 0 6 6"
              />
            </div>

            <span>
              {{ plugin.author }}
            </span>
          </span>
        </div>

        <div class="PluginDetailsModal__header__actions">
          <ButtonGeneric
            v-if="!isInstalled"
            :label="$t('COMMON.INSTALL')"
            class="m-0"
            @click="emitInstall"
          />
          <template v-else>
            <PluginManagerButtonSwitch
              :is-active="isEnabled"
              :label="switchButtonLabel"
              class="mr-2"
              @change="toggleStatus"
            />
            <span
              v-tooltip="{
                content: updateTooltipContent,
                placement: 'bottom'
              }"
            >
              <ButtonIconGeneric
                icon="update"
                view-box="0 0 14 15"
                class="m-0"
                :disabled="!isUpdateAvailable"
                @click="emitUpdate"
              />
            </span>
            <ButtonIconGeneric
              icon="trash"
              view-box="0 0 14 15"
              class="ml-2 mr-0"
              @click="emitRemove"
            />
          </template>
        </div>
      </div>
    </template>

    <template #content>
      <p class="mb-4 leading-tight">
        {{ plugin.description }}
      </p>

      <a
        v-if="plugin.permissions && plugin.permissions.length"
        href="#"
      >
        {{ $t('PAGES.PLUGIN_MANAGER.SHOW_PERMISSIONS') }}
      </a>

      <div class="PluginDetailsModal__stats">
        <div>
          <span>{{ $t('COMMON.CATEGORY') }}</span>
          <span
            v-tooltip="categoryTooltip"
            class="mr-auto pr-1"
          >
            {{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${plugin.categories[0].toUpperCase()}`) }}
          </span>
        </div>
        <div>
          <span>{{ $t('COMMON.URL') }}</span>
          <button
            class="flex items-center text-blue"
            :disabled="!homepageLink"
            @click="openExternal(plugin.homepage)"
          >
            {{ homepageLink || 'n.a.' }}
            <SvgIcon
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light ml-1"
            />
          </button>
        </div>
        <div>
          <span>{{ $t('COMMON.SIZE') }}</span>
          {{ formatter_bytes(plugin.size) }}
        </div>
        <div>
          <span>{{ $t('COMMON.VERSION') }}</span>
          {{ plugin.version }}
        </div>
      </div>
    </template>
  </PluginManagerModalWindow>
</template>

<script>
import domain from 'getdomain'
import { ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import { PluginLogo } from '@/components/PluginManager'
import PluginManagerModalWindow from '@/components/PluginManager/PluginManagerModals/PluginManagerModalWindow'
import { PluginManagerButtonSwitch } from '@/components/PluginManager/PluginManagerButtons'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginDetailsModal',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerButtonSwitch,
    PluginManagerModalWindow,
    PluginLogo,
    SvgIcon
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  computed: {
    isEnabled () {
      return this.$store.getters['plugin/isEnabled'](this.plugin.id)
    },

    isInstalled () {
      return this.$store.getters['plugin/isInstalled'](this.plugin.id)
    },

    switchButtonLabel () {
      if (this.isEnabled) {
        return this.$t('PAGES.PLUGIN_MANAGER.ENABLED')
      }

      return this.$t('PAGES.PLUGIN_MANAGER.DISABLED')
    },

    isUpdateAvailable () {
      return this.$store.getters['plugin/isUpdateAvailable'](this.plugin.id)
    },

    updateTooltipContent () {
      if (this.isUpdateAvailable) {
        const version = this.$store.getters['plugin/latestVersion'](this.plugin.id)
        return this.$t('PAGES.PLUGIN_MANAGER.UPDATE.AVAILABLE', { version })
      }

      return this.$t('PAGES.PLUGIN_MANAGER.UPDATE.NOT_AVAILABLE')
    },

    categoryTooltip () {
      if (this.plugin.categories.length <= 1) {
        return
      }

      return {
        content: this.plugin.categories.map(category => {
          return this.$t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${category.toUpperCase()}`)
        }).join('\n'),
        placement: 'right'
      }
    },

    homepageLink () {
      try {
        return domain.get(this.plugin.homepage)
      } catch (error) {
        return null
      }
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    },

    emitInstall () {
      this.$emit('install', this.plugin.id)
    },

    emitUpdate () {
      this.$emit('update', this.plugin)
    },

    emitRemove () {
      this.$emit('remove', this.plugin)
    },

    openExternal (target) {
      this.electron_openExternal(target)
    },

    toggleStatus (enabled) {
      this.$store.dispatch('plugin/setEnabled', {
        enabled,
        pluginId: this.plugin.id
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginDetailsModal__header__details {
  @apply flex items-center mt-1 text-theme-page-text-light;
}
.PluginDetailsModal__header__actions {
  @apply flex items-center
}

.PluginDetailsModal__stats {
  display: grid;
  grid-template-columns: 1fr 1fr 0.75fr 0.75fr;
  grid-column-gap: 1.5rem;
  @apply border-t pt-4 mt-8 border-theme-line-separator
}
.PluginDetailsModal__stats > div {
  @apply flex flex-col border-r border-dashed border-theme-line-separator py-2
}
.PluginDetailsModal__stats > div:not(:last-child) {
  @apply pr-6
}
.PluginDetailsModal__stats > div:last-child {
  @apply border-none
}
.PluginDetailsModal__stats > div span:first-child {
  @apply text-theme-page-text-light mb-1
}
</style>
