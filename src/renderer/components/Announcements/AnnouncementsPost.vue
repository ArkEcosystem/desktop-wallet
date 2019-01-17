<template>
  <div class="AnnouncementsPost flex flex-col md:flex-row items-top relative">
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

    <div class="flex flex-col flex-none justify-start w-48">
      <span class="AnnouncementsPost__date font-semibold">
        {{ formattedDate }}
        <span class="text-theme-page-text-light">
          {{ weekday }}
        </span>
      </span>

      <a
        :title="title"
        class="hidden md:flex items-center mt-2 cursor-pointer"
        @click="openInBrowser(url)"
      >
        <SvgIcon
          class="mr-2"
          name="open-external"
          view-box="0 0 12 12"
        />

        {{ $t('ANNOUNCEMENTS.READ_MORE') }}
      </a>
    </div>

    <div>
      <h2
        :class="isRead ? 'text-theme-page-text-light' : 'text-theme-page-text'"
        class="AnnouncementsPost__title text-2xl mt-4 md:mt-0 pr-8"
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
        class="flex md:hidden items-center mt-4 cursor-pointer"
        @click="openInBrowser(url)"
      >
        <SvgIcon
          class="mr-2"
          name="open-external"
          view-box="0 0 12 12"
        />

        {{ $t('ANNOUNCEMENTS.READ_MORE') }}
      </a>
    </div>
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
    date: {
      type: String,
      required: true
    },
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

  computed: {
    formattedDate () {
      return this.formatter_date(this.date, 'D MMMM')
    },

    weekday () {
      return this.formatter_date(this.date, 'dddd')
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
.AnnouncementsPost__date {
  line-height: 1.75rem;
}
.AnnouncementsPost__title {
  line-height: 1.75rem;
}
</style>
