<template>
  <nav class="AppSidemenu bg-theme-feature flex flex-col w-18 mx-6 rounded-lg justify-between relative">

    <div>
      <!-- ARK logo -->
      <router-link
        :to="{ name: 'dashboard' }"
        class="bg-red px-3 py-4 rounded-t-lg flex justify-center items-center">
        <img
          class="w-18"
          src="@/assets/images/ark-logo.png"
        >
      </router-link>

      <!-- Wallets -->
      <AppSidemenuItem
        :is-active="activeItem === 'wallets'"
        name="wallets"
        icon="wallet"
        @click="redirect($event)"
      />

      <!-- Add contact -->
      <AppSidemenuItem
        :is-active="activeItem === 'contacts'"
        name="contacts"
        icon="contact-add"
        @click="redirect($event)"
      />
    </div>

    <div>
      <!-- Announcements -->
      <AppSidemenuItem
        :is-active="activeItem === 'announcements'"
        :show-badge="showUnread"
        name="announcements"
        icon="whitepaper"
        @click="redirect($event)"
      />
    </div>

    <div>
      <AppSidemenuOptionsSettings v-show="isSettingsVisible" />

      <!-- Settings -->
      <AppSidemenuItem
        :is-active="activeItem === 'settings'"
        name="settings"
        icon="settings"
        @click="toggleShowSettings"
      />

      <!-- Networks -->
      <AppSidemenuItem
        :is-active="activeItem === 'networks'"
        name="networks"
        icon="cloud"
        @click="redirect($event)"
      />

      <!-- Profile settings -->
      <div class="cursor-pointer mt-2 mb-4 px-3 align-self-end">
        <router-link
          :to="{ name: 'profiles' }"
          class="h-12 w-12 flex items-center justify-center">
          <img
            src="@/assets/images/profile-menu.png"
            class="max-w-49px max-h-50px"
          >
        </router-link>
      </div>
    </div>

  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import AppSidemenuItem from './AppSidemenuItem'
import AppSidemenuOptionsSettings from './AppSidemenuOptionsSettings'

export default {
  name: 'AppSidemenu',

  components: {
    AppSidemenuItem,
    AppSidemenuOptionsSettings
  },

  data: vm => ({
    isSettingsVisible: false,
    activeItem: vm.$route.name
  }),

  computed: {
    ...mapGetters({ unreadAnnouncements: 'announcements/unread' }),
    showUnread () {
      return this.unreadAnnouncements.length > 0
    }
  },

  created () {
    this.$store.dispatch('announcements/sync')
  },

  methods: {
    redirect (name) {
      this.isSettingsVisible = false
      this.setActive(name)
      this.$router.push({ name })
    },

    setActive (name) {
      this.activeItem = name
    },

    toggleShowSettings () {
      this.isSettingsVisible = !this.isSettingsVisible
      this.setActive(this.isSettingsVisible ? 'settings' : null)
    }
  }
}
</script>
