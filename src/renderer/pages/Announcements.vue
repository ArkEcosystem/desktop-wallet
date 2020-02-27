<template>
  <div class="Announcements relative overflow-y-auto bg-theme-feature rounded-lg">
    <div class="Announcements--gradient-top sticky pin-t h-10" />

    <main class="flex-col px-10">
      <div class="Announcements__header">
        <h3 class>
          {{ $t('ANNOUNCEMENTS.LATEST_NEWS') }}
        </h3>

        <button
          v-if="showReadAll"
          class="Announcements__ReadAll text-theme-feature-item-text hover:text-theme-page-text transition"
          @click="readAll"
        >
          <SvgIcon
            name="mark-all"
            view-box="0 0 15 15"
            class="mr-2"
          />

          {{ $t('ANNOUNCEMENTS.ALL_READ') }}
        </button>
      </div>

      <TransitionGroup
        tag="div"
        name="Announcements__posts"
        class="mt-10"
      >
        <div
          v-for="(announcement, index) in announcements"
          :key="announcement.guid"
          class="mb-6"
        >
          <AnnouncementsPost
            v-bind="announcement"
            @read="read(announcement)"
          />

          <div
            v-if="index < announcements.length - 1"
            class="Announcements__line-separator mt-6"
          />
        </div>
      </TransitionGroup>
    </main>

    <div class="Announcements--gradient-bottom sticky pin-b h-10" />
  </div>
</template>

<script>
import { orderBy } from 'lodash'
import { mapGetters } from 'vuex'
import { AnnouncementsPost } from '@/components/Announcements'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'Announcements',

  components: {
    AnnouncementsPost,
    SvgIcon
  },

  computed: {
    ...mapGetters({
      readAnnouncements: 'announcements/read',
      unreadAnnouncements: 'announcements/unread'
    }),

    announcements () {
      const all = this.unreadAnnouncements.concat(this.readAnnouncements)
      return orderBy(all, ['isRead', 'date'], ['asc', 'desc'])
    },

    showReadAll () {
      return this.unreadAnnouncements && this.unreadAnnouncements.length
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('announcements')
      vm.$synchronizer.pause('market')
    })
  },

  methods: {
    read (announcement) {
      this.$store.dispatch('announcements/markAsRead', announcement)
    },

    readAll () {
      this.$store.dispatch('announcements/markAsReadBulk', this.unreadAnnouncements)
    }
  }
}
</script>

<style lang="postcss" scoped>
.Announcements__header {
  @apply .flex .items-center .justify-between;
}
.Announcements__header .Announcements__ReadAll {
  @apply .flex .items-center .font-semibold;
}
.Announcements__line-separator {
  height: 1px;
  background: linear-gradient(to right, var(--theme-line-separator) 50%, transparent 50%);
  background-repeat: repeat-x;
  background-size: 0.5rem;
}

/* These gradients are at the edges of the main area to fade the announcements */
.Announcements--gradient-top {
  background: linear-gradient(
    to top,
    var(--theme-announcements-gradient-1),
    var(--theme-announcements-gradient-2) 100%
  );
  z-index: 1;
}
.Announcements--gradient-bottom {
  background: linear-gradient(
    to bottom,
    var(--theme-announcements-gradient-1),
    var(--theme-announcements-gradient-2) 100%
  );
  z-index: 1;
}

/* Transition when showing all the announcements the first time */
.Announcements__posts-enter-active {
  transition: all 1s;
}
.Announcements__posts-enter {
  opacity: 0;
  transform: translateY(30px);
}

/* Transition when reading an announcement */
.Announcements__posts-move {
  transition: transform 1s;
}
</style>
