<template>
  <ModalWindow
    :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    header-classes="flex p-8 -mx-16 -mt-16 bg-theme-secondary-feature rounded-t-lg"
    container-classes="PluginDetailsModal max-w-md"
    @close="emitClose"
  >
    <template #header>
      <PluginLogo
        :plugin="plugin"
        :size="120"
      />

      <div class="flex flex-col ml-5 justify-between">
        <div>
          <div class="flex items-center">
            <span class="text-theme-page-text font-semibold text-xl">
              {{ plugin.title }}
            </span>
            <PluginManagerCheckmark v-if="plugin.isOfficial" />
            <PluginManagerGrants v-else-if="plugin.isGrant" />
          </div>

          <span
            class="PluginDetailsModal__header__details"
          >
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
            <span
              v-tooltip="{
                content: !isInstalledSupported ? $t('PAGES.PLUGIN_MANAGER.VERSION_MISMATCH') : '',
                placement: 'bottom'
              }"
            >
              <PluginManagerButtonSwitch
                :is-active="isEnabled"
                :is-disabled="!isInstalledSupported"
                class="mr-2"
                @change="toggleStatus"
              />
            </span>

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

          <span
            v-if="isAvailable"
            v-tooltip="{
              content: isBlacklisted ? $t('PAGES.PLUGIN_MANAGER.BLACKLISTED') : $t('PAGES.PLUGIN_MANAGER.REPORT'),
              placement: 'bottom'
            }"
          >
            <ButtonIconGeneric
              :disabled="isBlacklisted"
              icon="exclamation-mark"
              view-box="0 0 16 20"
              class="ml-2"
              @click="reportPlugin"
            />
          </span>
        </div>
      </div>
    </template>

    <template #default>
      <p
        class="PluginDetailsModal__description"
        :class="{
          'mt-12': !hasImages,
          'mt-4': hasImages
        }"
      >
        {{ plugin.description }}
      </p>

      <p
        v-if="plugin.keywords.length"
        class="PluginDetailsModal__keywords"
      >
        <span class="font-semibold">{{ $t('MODAL_PLUGIN_DETAILS.KEYWORDS') }}:</span> {{ keywordsText }}
        <span
          v-if="showKeywordsTooltip"
          v-tooltip="{
            content: keywordsTooltip,
            placement: 'right'
          }"
          class="pr-1"
        >...</span>
      </p>

      <a
        v-if="plugin.permissions && plugin.permissions.length"
        class="cursor-pointer"
        @click.stop="emitShowPermissions"
      >
        {{ $t('MODAL_PLUGIN_DETAILS.SHOW_PERMISSIONS') }}
      </a>

      <div class="mt-6">
        <SliderImage
          :is-row="true"
          :images="plugin.images"
        >
          <template slot-scope="{ imageIndex, closeImage }">
            <SliderImageModal
              :images="plugin.images"
              :image-index="imageIndex"
              :close-image="closeImage"
            />
          </template>
        </SliderImage>
      </div>

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
            v-if="homepageLink"
            class="flex items-center text-blue hover:underline"
            @click.stop="electron_openExternal(plugin.homepage)"
          >
            {{ homepageLink }}
            <SvgIcon
              name="open-external"
              view-box="0 0 12 12"
              class="text-theme-page-text-light ml-1"
            />
          </button>
          <span v-else>n.a.</span>
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
import { PluginLogo, PluginManagerCheckmark, PluginManagerGrants } from '@/components/PluginManager'
import { ModalWindow } from '@/components/Modal'
import { PluginManagerButtonSwitch } from '@/components/PluginManager/PluginManagerButtons'
import { SliderImage, SliderImageModal } from '@/components/Slider'
import SvgIcon from '@/components/SvgIcon'
import domain from 'getdomain'

export default {
  name: 'PluginDetailsModal',

  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    PluginManagerCheckmark,
    PluginManagerGrants,
    PluginManagerButtonSwitch,
    ModalWindow,
    PluginLogo,
    SliderImage,
    SliderImageModal,
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

    isInstalledSupported () {
      return this.$store.getters['plugin/isInstalledSupported'](this.plugin.id)
    },

    isBlacklisted () {
      return this.$store.getters['plugin/isBlacklisted'](this.plugin.id)
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

    keywordsText () {
      const keywords = this.plugin.keywords.slice(0, PLUGINS.maxKeywords).join(', ')
      return this.showKeywordsTooltip ? `${keywords}, ` : keywords
    },

    keywordsTooltip () {
      return this.plugin.keywords.slice(PLUGINS.maxKeywords).join('\n')
    },

    showKeywordsTooltip () {
      return this.plugin.keywords.length > PLUGINS.maxKeywords
    },

    homepageLink () {
      try {
        return domain.get(this.plugin.homepage)
      } catch (error) {
        return null
      }
    },

    hasImages () {
      return this.plugin.images && this.plugin.images.length > 0
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

    toggleStatus (enabled) {
      this.$emit('change-status', enabled, this.plugin.id)
    },

    reportPlugin () {
      const params = new URLSearchParams({
        subject: 'desktop_wallet_plugin_report',
        plugin_id: this.plugin.id,
        plugin_version: this.plugin.version
      })

      this.electron_openExternal(`${PLUGINS.reportUrl}?${params.toString()}`)

      this.$emit('report')
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginDetailsModal .ModalWindow__container__content {
  @apply .pb-8;
}
.PluginDetailsModal .ModalWindow__container__footer--warning {
  @apply .py-4;
}
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
.PluginDetailsModal__description {
  @apply mb-4 leading-tight
}
.PluginDetailsModal__keywords {
  @apply mb-4
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
