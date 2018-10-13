<template>
  <MenuNavigation
    v-model="activeItem"
    :class="[horizontal ? 'h-18 mb-3 flex-row' : 'w-18 mx-6 rounded-lg flex-col']"
    class="AppSidemenu justify-between relative"
  >

    <div :class="{'flex flex-row h-18' : horizontal}">
      <!-- ARK logo -->
      <router-link
        :to="{ name: 'dashboard' }"
        :class="[horizontal ? 'py-3 px-4 flex-row w-22' : 'px-3 py-4 rounded-t-lg']"
        class="bg-red flex justify-center items-center">
        <img
          :class="[horizontal ? 'h-12' : 'w-18']"
          src="@/assets/images/ark-logo.png"
        >
      </router-link>

      <!-- Wallets -->
      <MenuNavigationItem
        id="wallets"
        :class="[horizontal ? 'w-16' : 'h-16']"
        :horizontal="horizontal"
        icon="wallet"
        @click="redirect($event)"
      />

      <!-- Add contact -->
      <MenuNavigationItem
        id="contacts"
        :class="[horizontal ? 'w-16' : 'h-16']"
        :horizontal="horizontal"
        icon="contact-add"
        @click="redirect($event)"
      />
    </div>

    <div :class="{'flex flex-row h-18' : horizontal}">
      <!-- Announcements -->
      <MenuNavigationItem
        id="announcements"
        :class="[horizontal ? 'w-16' : 'h-16']"
        :horizontal="horizontal"
        :show-badge="showUnread"
        icon="whitepaper"
        @click="redirect($event)"
      />
    </div>

    <div :class="{'flex flex-row h-18' : horizontal}">
      <AppSidemenuSettings
        v-show="isSettingsVisible"
        :outside-click="isSettingsVisible"
        @close="closeShowSettings"
      />

      <!-- Settings -->
      <MenuNavigationItem
        id="settings"
        :class="[horizontal ? 'w-16' : 'h-16']"
        :horizontal="horizontal"
        icon="settings"
        @click="toggleShowSettings"
      />

      <!-- Networks -->
      <MenuNavigationItem
        id="networks"
        :class="[horizontal ? 'w-16' : 'h-16']"
        :horizontal="horizontal"
        icon="cloud"
        @click="redirect($event)"
      />

      <!-- Profile settings -->
      <div
        :class="[horizontal ? 'ml-2 mr-4 py-3' : 'mt-2 mb-4 px-3']"
        class="cursor-pointer align-self-end">
        <router-link
          :class="[horizontal ? 'h-12 w-12 bg-no-repeat' : 'h-18 w-18']"
          :style="session_profile.avatar ? `backgroundImage: url('${assets_loadImage(session_profile.avatar)}')` : ''"
          :title="$t('APP_SIDEMENU.CURRENT_PROFILE', { profileName: session_profile.name })"
          :to="{ name: 'profiles' }"
          class="AppSidemenu__avatar flex background-image"
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

  props: {
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    }
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
    },

    closeShowSettings () {
      if (this.isSettingsVisible) {
        this.isSettingsVisible = false
        this.setActive(null)
      }
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
