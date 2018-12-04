<template>
  <div class="Announcements relative overflow-y-auto bg-theme-feature rounded-lg">
    <div class="Announcements--gradient-top sticky pin-t h-12" />

    <main class="flex-col px-12">
      <h1 class="text-lg mb-5">
        {{ $t('ANNOUNCEMENTS.LATEST_NEWS') }}
      </h1>

      <TransitionGroup
        tag="div"
        name="Announcements__posts"
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
            v-if="index <= announcements.length - 2"
            class="Announcements__line-separator mt-6"
          />
        </div>
      </TransitionGroup>
    </main>

    <div class="Announcements--gradient-bottom sticky pin-b h-12" />
  </div>
</template>

<script>
import { sortBy } from 'lodash'
import { mapGetters } from 'vuex'
import { AnnouncementsPost } from '@/components/Announcements'

export default {
  name: 'Announcements',

  components: {
    AnnouncementsPost
  },

  computed: {
    ...mapGetters({
      readAnnouncements: 'announcements/read',
      unreadAnnouncements: 'announcements/unread'
    }),
    announcements () {
      const readSorted = sortBy(this.readAnnouncements, 'date').reverse()
      const unreadSorted = sortBy(this.unreadAnnouncements, 'date').reverse()
      return unreadSorted.concat(readSorted)
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
    }
  }
}
</script>

<style scoped>
.Announcements__line-separator {
  height: 1rem;
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
