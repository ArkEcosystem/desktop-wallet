<template>
  <ModalWindow
    :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    header-classes="flex p-8 -mx-16 -mt-16 bg-theme-secondary-feature rounded-t-lg"
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
            <PluginManagerCheckmark v-if="plugin.isOfficial" />

            <span>
              {{ plugin.author }}
            </span>
          </span>
        </div>

        <div class="PluginDetailsModal__header__actions">
          <ButtonGeneric
            v-if="!isInstalled"
            :label="$t('MODAL_PLUGIN_DETAILS.INSTALL')"
            class="m-0"
            @click="emitShowPermissions"
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
                view-box="0 0 14 20"
                class="m-0"
                :disabled="!isUpdateAvailable"
                @click="emitUpdate"
              />
            </span>

            <ButtonIconGeneric
              icon="trash"
              view-box="0 0 14 20"
              class="ml-2 mr-0"
              @click="emitRemove"
            />
          </template>

          <ButtonIconGeneric
            v-if="isAvailable"
            v-tooltip="{
              content: $t('PAGES.PLUGIN_MANAGER.REPORT'),
              placement: 'bottom'
            }"
            icon="exclamation-mark"
            view-box="0 0 16 20"
            class="ml-2"
            @click="reportPlugin"
          />
        </div>
      </div>
    </template>

    <template #default>
      <p class="mt-12 mb-4 leading-tight">
        {{ plugin.description }}
      </p>

      <a
        v-if="plugin.permissions && plugin.permissions.length"
        class="cursor-pointer"
        @click.stop="emitShowPermissions"
      >
        {{ $t('MODAL_PLUGIN_DETAILS.SHOW_PERMISSIONS') }}
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
            class="flex items-center text-blue hover:underline"
            :disabled="!homepageLink"
            @click.stop="openExternal(plugin.homepage)"
          >
            {{ homepageLink || 'n.a.' }}
            <SvgIcon
              v-if="homepageLink"
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light ml-1"
            />
          </button>
        </div>
        <div>
          <span>{{ $t('COMMON.SIZE') }}</span>
          <span class="whitespace-no-wrap">
            {{ plugin.size ? formatter_bytes(plugin.size) : 'n.a.' }}
          </span>
        </div>
        <div>
          <span>{{ $t('COMMON.VERSION') }}</span>
          <span class="whitespace-no-wrap">
            {{ plugin.version }}
          </span>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<script>
import { PLUGINS } from '@config'
import { ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import { PluginLogo, PluginManagerCheckmark } from '@/components/PluginManager'
import { ModalWindow } from '@/components/Modal'
import { PluginManagerButtonSwitch } from '@/components/PluginManager/PluginManagerButtons'
import SvgIcon from '@/components/SvgIcon'
import domain from 'getdomain'

export default {
  name: 'PluginDetailsModal',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerCheckmark,
    PluginManagerButtonSwitch,
    ModalWindow,
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

    isAvailable () {
      return this.$store.getters['plugin/isAvailable'](this.plugin.id)
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

    emitUpdate () {
      this.$emit('update', this.plugin)
    },

    emitRemove () {
      this.$emit('remove', this.plugin)
    },

    emitShowPermissions () {
      this.$emit('show-permissions')
    },

    openExternal (target) {
      this.electron_openExternal(target)
    },

    toggleStatus (enabled) {
      this.$store.dispatch('plugin/setEnabled', {
        enabled,
        pluginId: this.plugin.id
      })
    },

    reportPlugin () {
      const params = new URLSearchParams({
        subject: 'desktop_wallet_plugin_report',
        plugin_id: this.plugin.id,
        plugin_version: this.plugin.version
      })

      this.openExternal(`${PLUGINS.reportUrl}?${params.toString()}`)
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

.PluginDetailsModal__permission {
  @apply flex flex-col py-4 border-b border-dashed border-theme-line-separator
}
.PluginDetailsModal__permission:last-of-type {
  @apply border-none pb-0
}
</style>
