<template>
  <div class="AnnouncementsPost relative">
    <button
      v-show="!isRead"
      class="AnnouncementsPost__close transition absolute pin-t pin-r cursor-pointer text-theme-page-text-light hover:text-theme-page-text p-2"
      @click="emitRead"
    >
      <SvgIcon
        class="fill-current"
        name="cross"
        view-box="0 0 15 15"
      />
    </button>

    <h2
      :class="isRead ? 'text-theme-page-text-light' : 'text-theme-page-text'"
      class="text-2xl pr-8"
    >
      {{ title }}
    </h2>

    <p
      v-if="!isRead"
      class="AnnouncementsPost__summary mt-2"
    >
      {{ summary }}
    </p>

    <a
      :title="title"
      class="inline-block mt-4 cursor-pointer"
      @click="openInBrowser(url)"
    >
      {{ $t('ANNOUNCEMENTS.READ_MORE') }} &#8594;
    </a>
  </div>
</template>

<script>
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'AnnouncementsPost',

  components: {
    SvgIcon
  },

  props: {
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    emitRead () {
      this.$emit('read', this.announcement)
    },
    openInBrowser (url) {
      this.electron_openExternal(url)
      setTimeout(() => this.emitRead(), 2000)
    }
  }
}
</script>

<style scoped>
.AnnouncementsPost__close {
  /* The close button is shown only on hover over the entire announcement */
  display: none;
}
.AnnouncementsPost:hover > .AnnouncementsPost__close {
  display: block;
}
</style>
