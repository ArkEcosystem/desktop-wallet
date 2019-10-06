<template>
  <ModalWindow
    :title="title"
    :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    container-classes="max-w-md"
    @close="emitClose"
  >
    <template #default>
      <section v-if="!isDownloadAuthorized">
        <div class="PluginInstallModal__permission__container">
          <div
            v-for="permission of plugin.permissions"
            :key="permission"
            class="PluginInstallModal__permission"
          >
            <span class="text-theme-page-text-light">
              {{ $t(`PAGES.PLUGIN_MANAGER.PERMISSIONS.${permission}`) }}
            </span>
          </div>
        </div>
      </section>

      <section
        v-else
        class="PluginInstallModal__authorized"
      >
        <img
          :src="installImage"
          class="PluginInstallModal__authorized__image"
        >

        <div
          class="PluginInstallModal__authorized__downloading"
        >
          <div class="PluginInstallModal__authorized__downloading__header">
            <i18n
              :path="`MODAL_PLUGIN_INSTALL.${isDownloadFinished ? 'DOWNLOADED' : 'DOWNLOADING'}`"
              tag="span"
              class="PluginInstallModal__authorized__downloading__header__title"
            >
              <strong place="plugin">{{ plugin.id }}</strong>
            </i18n>

            <div class="PluginInstallModal__authorized__downloading__header__info">
              <span class="font-semibold">{{ formatter_percentage(progressUpdate.percent, 2, 2) }}</span>
              <span class="ml-2 text-theme-page-text-light truncate">
                {{ formatter_bytes(progressUpdate.transferred) }} / {{ formatter_bytes(progressUpdate.total) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer
        v-if="!isDownloadFailed"
        class="PluginInstallModal__footer"
      >
        <button
          class="blue-button"
          @click="emitClose"
        >
          {{ $t('MODAL_PLUGIN_INSTALL.CANCEL') }}
        </button>

        <button
          v-if="!isDownloadAuthorized"
          class="blue-button"
          @click="emitDownload"
        >
          {{ $t('MODAL_PLUGIN_INSTALL.DOWNLOAD') }}
        </button>

        <button
          v-else-if="isDownloadFinished && !isDownloadFailed"
          class="blue-button"
          @click="emitInstall"
        >
          {{ $t('MODAL_PLUGIN_INSTALL.INSTALL') }}
        </button>
      </footer>

      <footer
        v-else
        class="PluginInstallModal__footer--failed"
      >
        <span>
          {{ errorMessage ? errorMessage : 'unknown error' }}
        </span>
      </footer>
    </template>
  </ModalWindow>
</template>

<script>
import { ipcRenderer } from 'electron'
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'PluginInstallModal',

  components: {
    ModalWindow
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    errorMessage: undefined,
    isDownloadAuthorized: false,
    isDownloadFinished: false,
    isDownloadFailed: false,
    isDownloadCancelled: false,
    percent: 0,
    progressUpdate: {
      percent: 0,
      total: 0,
      transferred: 0
    }
  }),

  computed: {
    title () {
      if (this.isDownloadAuthorized) {
        return
      }
      return this.$t('MODAL_PLUGIN_INSTALL.TITLE')
    },

    installImage () {
      const image = this.session_hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/updater/computer-${image}.svg`)
    }
  },

  mounted () {
    ipcRenderer.on('plugin-manager:download-progress', (_, data) => {
      Object.assign(this.progressUpdate, data)
    })

    ipcRenderer.on('plugin-manager:plugin-downloaded', () => {
      this.isDownloadFinished = true
    })

    ipcRenderer.on('plugin-manager:error', (_, error) => {
      this.isDownloadFailed = true
      this.errorMessage = error instanceof Error ? error.message : undefined
    })
  },

  methods: {
    cancel () {
      this.isDownloadCancelled = true
      ipcRenderer.send('plugin-manager:cancel')
    },

    cleanup () {
      ipcRenderer.send('plugin-manager:cleanup')
    },

    emitDownload () {
      this.isDownloadAuthorized = true
      this.$emit('download', this.plugin.source)
    },

    emitInstall () {
      this.$emit('install')
    },

    emitClose () {
      if (this.isDownloadAuthorized && !this.isDownloadFailed) {
        if (!this.isDownloadFinished) {
          this.cancel()
        } else {
          this.cleanup()
        }
      }

      this.$emit('close')
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginInstallModal {
}

PluginInstallModal__permission__container {
  max-height: 400px;
  @apply overflow-y-scroll
}
.PluginInstallModal__permission {
  @apply flex flex-col py-4
}
.PluginInstallModal__permission:not(:last-child) {
  @apply border-b border-dashed border-theme-line-separator
}

.PluginInstallModal__authorized {
  @apply flex flex-col
}
.PluginInstallModal__authorized__image {
  width: 30rem;
  height: 12rem;
  @apply mx-auto
}
.PluginInstallModal__authorized__downloading__header {
  @apply flex flex-col
}
.PluginInstallModal__authorized__downloading__header__title {
  @apply text-xl my-4 text-center
}
.PluginInstallModal__authorized__downloading__header__info {
  @apply flex my-2 justify-center
}

.PluginInstallModal__footer {
  @apply mt-10 flex justify-between items-center
}
.PluginInstallModal__footer--failed {
  @apply py-5 bg-theme-error text-white
}
</style>
