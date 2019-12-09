<template>
  <ModalWindow
    :message="$t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    container-classes="max-w-md"
    @close="emitClose"
  >
    <template #default>
      <section class="PluginInstallModal__authorized">
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
              <strong slot="plugin">{{ plugin.title }}</strong>
            </i18n>

            <div class="PluginInstallModal__authorized__downloading__header__info">
              <span class="font-semibold">{{ formatter_percentage(normalizedPercentage, 2, 2) }}</span>
              <span
                v-if="progress.totalBytes"
                class="ml-2 text-theme-page-text-light truncate"
              >
                {{ transferred }} / {{ total }}
              </span>
            </div>
          </div>
          <div class="PluginInstallModal__progress-bar">
            <ProgressBar
              :percent="normalizedPercentage"
              :status="isDownloadFailed ? 'exception' : 'active'"
            />
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
          v-if="isDownloadFinished && !isDownloadFailed"
          class="blue-button"
          @click="emitInstall"
        >
          {{ $t(`MODAL_PLUGIN_INSTALL.${isUpdate ? 'UPDATE' : 'INSTALL'}`) }}
        </button>
      </footer>
    </template>

    <template #footer>
      <footer v-if="isDownloadFailed">
        <div class="ModalWindow__container__footer--error">
          {{ errorMessage ? errorMessage : $t('MODAL_PLUGIN_INSTALL.UNKNOWN_ERROR') }}
        </div>
      </footer>
    </template>
  </ModalWindow>
</template>

<script>
import { ipcRenderer } from 'electron'
import { ModalWindow } from '@/components/Modal'
import { ProgressBar } from '@/components/ProgressBar'

export default {
  name: 'PluginInstallModal',

  components: {
    ModalWindow,
    ProgressBar
  },

  props: {
    plugin: {
      type: Object,
      required: true
    },
    isUpdate: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data: () => ({
    errorMessage: undefined,
    isDownloadFinished: false,
    isDownloadFailed: false,
    isDownloadCancelled: false,
    progress: {
      percent: 0,
      transferredBytes: 0,
      totalBytes: 0
    }
  }),

  computed: {
    installImage () {
      const image = this.session_hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/updater/computer-${image}.svg`)
    },

    normalizedPercentage () {
      return parseInt(this.progress.percent * 100, 10)
    },

    transferred () {
      return this.formatter_bytes(this.progress.transferredBytes)
    },

    total () {
      return this.formatter_bytes(this.progress.totalBytes)
    }
  },

  mounted () {
    ipcRenderer.on('plugin-manager:download-progress', this.onProgress)
    ipcRenderer.on('plugin-manager:plugin-downloaded', this.onPluginDownloaded)
    ipcRenderer.on('plugin-manager:error', this.onError)

    this.emitDownload()
  },

  beforeDestroy () {
    ipcRenderer.removeListener('plugin-manager:download-progress', this.onProgress)
    ipcRenderer.removeListener('plugin-manager:plugin-downloaded', this.onPluginDownloaded)
    ipcRenderer.removeListener('plugin-manager:error', this.onError)
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
      let source = this.plugin.source

      if (this.isUpdate) {
        source = (this.$store.getters['plugin/availableById'](this.plugin.id)).config.source
      }

      this.$emit('download', source)
    },

    emitInstall () {
      this.$emit('install')
    },

    emitClose () {
      if (!this.isDownloadFailed && !this.isDownloadFinished) {
        this.cancel()
      } else {
        this.cleanup()
      }

      this.$emit('close')
    },

    onProgress (_, progress) {
      Object.assign(this.progress, progress)
    },

    onPluginDownloaded () {
      this.isDownloadFinished = true
    },

    onError (_, error) {
      this.isDownloadFailed = true
      this.errorMessage = error instanceof Error ? error.message : undefined
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginInstallModal {
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

.PluginInstallModal__progress-bar {
  @apply w-full
}
.PluginInstallModal__footer {
  @apply flex justify-between items-center mt-5
}
</style>
