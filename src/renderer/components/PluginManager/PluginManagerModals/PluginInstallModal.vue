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
              <strong slot="plugin">{{ plugin.id }}</strong>
            </i18n>

            <div class="PluginInstallModal__authorized__downloading__header__info">
              <span class="font-semibold">{{ formatter_percentage(normalizedPercentage, 2, 2) }}</span>
              <span
                v-if="progressUpdate.total"
                class="ml-2 text-theme-page-text-light truncate"
              >
                {{ formatter_bytes(progressUpdate.transferred) }} / {{ formatter_bytes(progressUpdate.total) }}
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
import { ProgressBar } from '@/components/ProgressBar'
import Vue from 'vue'

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
    }
  },

  data: () => ({
    errorMessage: undefined,
    isDownloadFinished: false,
    isDownloadFailed: false,
    isDownloadCancelled: false,
    progressUpdate: {
      percent: 0,
      total: 0,
      transferred: 0
    }
  }),

  computed: {
    installImage () {
      const image = this.session_hasDarkTheme ? 'dark' : 'light'
      return this.assets_loadImage(`pages/updater/computer-${image}.svg`)
    },

    normalizedPercentage () {
      return parseInt(this.progressUpdate.percent * 100, 10)
    }
  },

  mounted () {
    ipcRenderer.on('plugin-manager:download-progress', (_, data) => {
      Object.assign(this.progressUpdate, data)
    })

    ipcRenderer.on('plugin-manager:plugin-downloaded', () => {
      Vue.set(this.progressUpdate, 'percent', 1)
      this.isDownloadFinished = true
    })

    ipcRenderer.on('plugin-manager:error', (_, error) => {
      this.isDownloadFailed = true
      this.errorMessage = error instanceof Error ? error.message : undefined
    })

    this.emitDownload()
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
      this.$emit('download', this.plugin.source)
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
  @apply mt-10 flex justify-between items-center
}
.PluginInstallModal__footer--failed {
  @apply py-5 bg-theme-error text-white
}
</style>
