<template>
  <ModalWindow
    :can-resize="isDownloadAuthorized"
    :title="title"
    container-classes="AppUpdater--maximized"
    container-classes-minimized="AppUpdater--minimized"
    portal-target="updater"
    @close="emitClose"
  >
    <template #default="{ isMaximized }">
      <section v-if="!isDownloadAuthorized">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="AppUpdater__release-notes"
          v-html="releaseNotes"
        />
        <!-- eslint-enable vue/no-v-html -->
      </section>

      <section
        v-else
        class="AppUpdater__authorized"
      >
        <img
          :src="descriptionImage"
          class="AppUpdater__authorized__image"
        >
        <div
          class="AppUpdater__authorized__downloading"
        >
          <span class="AppUpdater__authorized__downloading__title">
            {{ $t('APP_UPDATER.DOWNLOADING', { version: availableRelease.version }) }}
          </span>
          <div class="AppUpdater__progress-bar">
            <ProgressBar
              :size="isMaximized ? 'normal' : 'small'"
              percent="60"
            />
          </div>
        </div>
      </section>
    </template>

    <template
      v-if="!isDownloadAuthorized"
      #footer
    >
      <div class="mb-5 px-10 flex flex-row justify-center">
        <button
          class="blue-button mx-1"
          @click="startDownload"
        >
          {{ $t('APP_UPDATER.DOWNLOAD_NOW') }}
        </button>

        <button
          class="action-button px-8 mx-1"
          @click="emitClose"
        >
          {{ $t('APP_UPDATER.MAYBE_LATER') }}
        </button>
      </div>
    </template>
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import { ProgressBar } from '@/components/ProgressBar'
import { mapGetters } from 'vuex'
import cheerio from 'cheerio'

export default {
  name: 'AppUpdater',

  components: {
    ModalWindow,
    ProgressBar
  },

  data: () => ({
    isDownloadAuthorized: false
  }),

  computed: {
    ...mapGetters('updater', [
      'availableRelease'
    ]),

    title () {
      if (this.isDownloadAuthorized) {
        return
      }

      return `${this.$t('APP_UPDATER.RELEASE_NOTES')} - ${this.availableRelease.version}`
    },

    releaseNotes () {
      return this.__formatReleaseNotes(this.availableRelease.releaseNotes)
    },

    descriptionImage () {
      return this.assets_loadImage('pages/updater/computer.svg')
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    },

    startDownload () {
      this.isDownloadAuthorized = true
    },

    __formatReleaseNotes (notes) {
      const $ = cheerio.load(notes)
      const hashTable = $('table').last()
      hashTable.prev('h3').remove() // Hash title
      hashTable.remove()
      // Convert anchor to span elements
      $('a').each((_, item) => (item.tagName = 'span'))
      return $.html()
    }
  }
}
</script>

<style lang="postcss">
.AppUpdater__release-notes {
  max-width: 400px;
  max-height: 400px;
  @apply overflow-y-auto;
}
.AppUpdater__release-notes h3 {
  @apply my-4 text-lg
}
.AppUpdater__release-notes li {
  @apply text-sm text-base leading-tight
}

.AppUpdater__authorized {
  @apply flex
}
.AppUpdater__authorized__downloading {
  @apply flex flex-col flex-1 justify-center
}
.AppUpdater__authorized__downloading__title {
  @apply font-semibold
}

.AppUpdater--minimized {
  width: 400px;
  height: 180px;
}

.AppUpdater--maximized .AppUpdater__authorized {@apply flex-col justify-center;}
.AppUpdater--minimized .AppUpdater__authorized {@apply flex-row;}

.AppUpdater--maximized .AppUpdater__authorized__image {width: 400px;}
.AppUpdater--minimized .AppUpdater__authorized__image {width: 180px;}

.AppUpdater--maximized .AppUpdater__authorized__downloading {@apply items-center;}

.AppUpdater--maximized .AppUpdater__authorized__downloading__title {@apply text-xl my-4;}
.AppUpdater--minimized .AppUpdater__authorized__downloading__title {@apply text-sm;}

.AppUpdater--maximized .AppUpdater__progress-bar {@apply w-4/5;}
.AppUpdater--minimized .AppUpdater__progress-bar {@apply w-full;}
</style>
