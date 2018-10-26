<template>
  <MenuNavigation
    v-model="activeItem"
    :class="horizontal ? 'h-18 flex-row' : 'w-18 mx-6 rounded-lg flex-col'"
    class="AppSidemenu justify-between relative"
  >

    <div :class="{'flex flex-row h-18' : horizontal}">
      <!-- ARK logo -->
      <router-link
        :to="{ name: 'dashboard' }"
        :class="horizontal ? 'py-3 px-4 flex-row w-22' : 'px-3 py-4 rounded-t-lg'"
        class="bg-red flex justify-center items-center">
        <img
          :class="horizontal ? 'h-12' : 'w-18'"
          src="@/assets/images/ark-logo.png"
        >
      </router-link>

      <!-- Wallets -->
      <MenuNavigationItem
        id="wallets"
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        icon="wallet"
        @click="redirect($event)"
      />

      <!-- Add contact -->
      <MenuNavigationItem
        id="contacts"
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        icon="contact-add"
        @click="redirect($event)"
      />
    </div>

    <div :class="{'flex flex-row h-18' : horizontal}">
      <!-- Important notification / new releases -->
      <AppSidemenuImportantNotification
        v-if="isImportantNotificationVisible && hasNewRelease"
        :horizontal="horizontal"
        :class="horizontal ? 'w-16' : 'h-16'"
        @close="hideImportantNotification"
      />
    </div>

    <div :class="{'flex flex-row h-18' : horizontal}">
      <!-- Announcements -->
      <MenuNavigationItem
        id="announcements"
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        :show-badge="showUnread"
        icon="whitepaper"
        @click="redirect($event)"
      />

      <!-- Search -->
      <!-- <MenuNavigationItem
        id="search"
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        view-box="0 0 20 20"
        icon="search"
        @click="redirect($event)"
      /> -->
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
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        icon="settings"
        @click="toggleShowSettings"
      />

      <AppSidemenuNetworkStatus
        v-show="isNetworkStatusVisible"
        :outside-click="isNetworkStatusVisible"
        @close="closeShowNetworkStatus"
      />
      <!-- Networks -->
      <MenuNavigationItem
        id="networks"
        :class="horizontal ? 'w-16' : 'h-16'"
        :horizontal="horizontal"
        icon="cloud"
        @click="toggleShowNetworkStatus"
      />

      <!-- Profile settings -->
      <div
        :class="horizontal ? 'ml-2 mr-4 py-3' : 'mt-2 mb-4 px-3'"
        class="cursor-pointer align-self-end">
        <router-link
          :class="horizontal ? 'h-12 w-12 bg-no-repeat' : 'h-18 w-18'"
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
import releaseService from '@/services/release'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import AppSidemenuSettings from './AppSidemenuSettings'
import AppSidemenuNetworkStatus from './AppSidemenuNetworkStatus'
import AppSidemenuImportantNotification from './AppSidemenuImportantNotification'

export default {
  name: 'AppSidemenu',

  components: {
    MenuNavigation,
    MenuNavigationItem,
    AppSidemenuSettings,
    AppSidemenuNetworkStatus,
    AppSidemenuImportantNotification
  },

  props: {
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: vm => ({
    isNetworkStatusVisible: false,
    isImportantNotificationVisible: true,
    isSettingsVisible: false,
    activeItem: vm.$route.name
  }),

  computed: {
    ...mapGetters({
      releaseVersion: 'app/latestReleaseVersion',
      unreadAnnouncements: 'announcements/unread'
    }),
    hasNewRelease () {
      return releaseService.currentVersion !== this.releaseVersion
    },
    showUnread () {
      return this.unreadAnnouncements.length > 0
    }
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

    hideImportantNotification () {
      this.isImportantNotificationVisible = false
    },

    toggleShowSettings () {
      this.isNetworkStatusVisible = false
      this.isSettingsVisible = !this.isSettingsVisible
      this.setActive(this.isSettingsVisible ? 'settings' : null)
    },

    toggleShowNetworkStatus () {
      this.isSettingsVisible = false
      this.isNetworkStatusVisible = !this.isNetworkStatusVisible
      this.setActive(this.isNetworkStatusVisible ? 'network-status' : null)
    },

    closeShowSettings () {
      if (this.isSettingsVisible) {
        this.isSettingsVisible = false
        this.setActive(null)
      }
    },

    closeShowNetworkStatus () {
      if (this.isNetworkStatusVisible) {
        this.isNetworkStatusVisible = false
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
