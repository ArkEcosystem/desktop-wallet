<template>
  <MenuNavigation
    v-model="activeItem"
    class="AppSidemenu w-18 mx-6 rounded-lg justify-between relative"
  >

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
      <MenuNavigationItem
        id="wallets"
        icon="wallet"
        class="h-16"
        @click="redirect($event)"
      />

      <!-- Add contact -->
      <MenuNavigationItem
        id="contacts"
        icon="contact-add"
        class="h-16"
        @click="redirect($event)"
      />
    </div>

    <div>
      <!-- Announcements -->
      <MenuNavigationItem
        id="announcements"
        :show-badge="showUnread"
        icon="whitepaper"
        class="h-16"
        @click="redirect($event)"
      />
    </div>

    <div>
      <AppSidemenuSettings v-show="isSettingsVisible" />

      <!-- Settings -->
      <MenuNavigationItem
        id="settings"
        icon="settings"
        class="h-16"
        @click="toggleShowSettings"
      />

      <!-- Networks -->
      <MenuNavigationItem
        id="networks"
        icon="cloud"
        class="h-16"
        @click="redirect($event)"
      />

      <!-- Profile settings -->
      <div class="cursor-pointer mt-2 mb-4 px-3 align-self-end">
        <router-link
          :style="session_profile.avatar ? `backgroundImage: url('${assets_loadImage(session_profile.avatar)}')` : ''"
          :title="$t('APP_SIDEMENU.CURRENT_PROFILE', { profileName: session_profile.name })"
          :to="{ name: 'profiles' }"
          class="AppSidemenu__avatar flex background-image h-18 w-18"
        />
      </div>
    </div>

  </MenuNavigation>
</template>

<script>
import { mapGetters } from 'vuex'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import AppSidemenuSettings from './AppSidemenuSettings'

export default {
  name: 'AppSidemenu',

  components: {
    MenuNavigation,
    MenuNavigationItem,
    AppSidemenuSettings
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
    this.$store.dispatch('announcements/fetch')
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

<style scoped>
.AppSidemenu__avatar {
  transition: opacity 0.5s;
  background-repeat: no-repeat;
  border: none;
}
.AppSidemenu__avatar:hover {
  opacity: 0.5;
}
</style>
