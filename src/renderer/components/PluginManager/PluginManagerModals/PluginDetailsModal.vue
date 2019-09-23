<template>
  <Portal
    :to="portalTarget"
  >
    <div
      class="PluginModal"
      @click="emitClose()"
    >
      <Transition name="PluginModal">
        <div class="PluginModal__wrapper flex items-center justify-center absolute">
          <div
            :class="containerClasses"
            class="PluginModal__container flex flex-col shadow mx-auto rounded-lg relative transition text-theme-text-content"
            @click.stop="void 0"
          >
            <div class="PluginModal__container__actions">
              <ButtonClose
                :disabled="!allowClose"
                icon-class="text-grey"
                class="PluginModal__close-button p-6"
                @click="emitClose()"
              />
            </div>

            <section class="PluginModal__container__header">
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
                    label="Install"
                    class="m-0"
                    @click="emitInstall"
                  />
                  <template v-else>
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
            </section>

            <section class="PluginModal__container__content">
              <p class="mb-4 leading-tight">
                {{ plugin.description }}
              </p>

              <a
                v-if="plugin.permissions && plugin.permissions.length"
                href="#"
              >
                {{ $t('PAGES.PLUGIN_MANAGER.SHOW_PERMISSIONS') }}
              </a>

              <div class="PluginModal__container__content__stats">
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
            </section>

            <!-- eslint-disable vue/no-v-html -->
            <slot name="footer">
              <footer
                v-if="message"
                class="PluginModal__container__footer--warning"
              >
                <p v-html="message" />
              </footer>
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </Portal>
</template>

<script>
import semver from 'semver'
import domain from 'getdomain'
import { ButtonClose, ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import PluginLogo from '@/components/PluginManager/PluginLogo'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginModal',

  components: {
    ButtonClose,
    ButtonGeneric,
    ButtonIconGeneric,
    PluginLogo,
    SvgIcon
  },

  props: {
    plugin: {
      type: Object,
      required: true
    },
    containerClasses: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    allowClose: {
      type: Boolean,
      required: false,
      default: true
    },
    portalTarget: {
      type: String,
      required: false,
      default: 'modal'
    }
  },

  computed: {
    isInstalled () {
      return this.$store.getters['plugin/isInstalled'](this.plugin.id)
    },

    isUpdateAvailable () {
      return semver.lt(this.plugin.version, this.latestVersion)
    },

    latestVersion () {
      const availablePlugin = this.$store.getters['plugin/availableById'](this.plugin.id)
      return availablePlugin ? availablePlugin.version : this.plugin.version
    },

    updateTooltipContent () {
      if (this.isUpdateAvailable) {
        return this.$t('PAGES.PLUGIN_MANAGER.UPDATE.AVAILABLE', { version: this.latestVersion })
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

  mounted () {
    document.addEventListener('keyup', this.onEscKey, { once: true })
  },

  destroyed () {
    document.removeEventListener('keyup', this.onEscKey)
  },

  methods: {
    emitClose () {
      if (!this.allowClose) {
        return
      }

      this.$emit('close')
    },

    emitInstall () {
      this.$emit('install', this.plugin)
    },

    emitUpdate () {
      this.$emit('update', this.plugin)
    },

    emitRemove () {
      this.$emit('remove', this.plugin)
    },

    onEscKey (event) {
      if (event.keyCode === 27) {
        this.emitClose()
      }
    },

    openExternal (target) {
      this.electron_openExternal(target)
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginModal-enter,
.PluginModal-leave-active {
  opacity: 0;
  transform: scale(1.1);
}

.PluginModal {
  @apply table fixed z-50 pin-t pin-l w-full h-full;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
}
.PluginModal .PluginModal__wrapper {
  @apply pin
}
.PluginModal__container__actions {
  @apply absolute pin-r block text-right my-4 mr-4
}
.PluginModal .PluginModal__container__header {
  @apply flex px-10 py-8 rounded-t-lg;
  background-color: #f7f9fb;
}

.PluginDetailsModal__header__details {
  @apply flex items-center mt-1 text-theme-page-text-light;
}
.PluginDetailsModal__header__actions {
  @apply flex items-center
}

.PluginModal .PluginModal__container__content {
  @apply overflow-hidden px-10 py-8 rounded-b-lg bg-theme-modal
}
.PluginModal .PluginModal__container__content__stats {
  display: grid;
  grid-template-columns: 1fr 1fr 0.75fr 0.75fr;
  grid-column-gap: 1.5rem;
  @apply border-t pt-4 mt-8
}
.PluginModal .PluginModal__container__content__stats > div {
  @apply flex flex-col border-r border-dashed py-2
}
.PluginModal .PluginModal__container__content__stats > div:not(:last-child) {
  @apply pr-6
}
.PluginModal .PluginModal__container__content__stats > div:last-child {
  @apply border-none
}
.PluginModal .PluginModal__container__content__stats > div span:first-child {
  @apply text-theme-page-text-light mb-1
}
.PluginModal__container__footer--warning {
  @apply px-10 py-8 bg-yellow-lighter text-grey-darkest rounded-lg mt-2 text-sm;
}
</style>
