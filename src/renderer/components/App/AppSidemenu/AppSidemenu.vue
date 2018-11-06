<template>
  <MenuNavigation
    v-model="activeItem"
    :class="isHorizontal ? 'h-18 flex-row' : 'w-18 mx-6 rounded-lg flex-col'"
    class="AppSidemenu justify-between relative"
  >

    <div :class="{'flex flex-row h-18' : isHorizontal}">
      <!-- ARK logo -->
      <router-link
        :title="$t('APP_SIDEMENU.DASHBOARD')"
        :to="{ name: 'dashboard' }"
        :class="isHorizontal ? 'py-3 px-4 flex-row w-22' : 'px-3 py-4 rounded-t-lg'"
        class="bg-red flex justify-center items-center"
      >
        <img
          :class="isHorizontal ? 'h-12' : 'w-18'"
          src="@/assets/images/ark-logo.png"
        >
      </router-link>

      <!-- Wallets -->
      <MenuNavigationItem
        id="wallets"
        :title="$t('APP_SIDEMENU.WALLETS')"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        icon="wallet"
        @click="redirect($event)"
      />

      <!-- Add contact -->
      <MenuNavigationItem
        id="contacts"
        :title="$t('APP_SIDEMENU.CONTACTS')"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        icon="contact-add"
        @click="redirect($event)"
      />
    </div>

    <div :class="{'flex flex-row h-18' : isHorizontal}">
      <!-- Important notification / new releases -->
      <AppSidemenuImportantNotification
        v-if="isImportantNotificationVisible && hasNewRelease"
        :is-horizontal="isHorizontal"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        @close="hideImportantNotification"
      />
    </div>

    <div :class="{'flex flex-row h-18' : isHorizontal}">
      <!-- Announcements -->
      <MenuNavigationItem
        id="announcements"
        :title="$t('APP_SIDEMENU.ANNOUNCEMENTS')"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        :show-badge="showUnread"
        icon="whitepaper"
        @click="redirect($event)"
      />

      <!-- Search -->
      <!-- <MenuNavigationItem
        id="search"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        view-box="0 0 20 20"
        icon="search"
        @click="redirect($event)"
      /> -->
    </div>

    <div :class="{'flex flex-row h-18' : isHorizontal}">
      <AppSidemenuSettings
        v-if="isSettingsVisible"
        :outside-click="true"
        :is-horizontal="isHorizontal"
        @close="closeShowSettings"
      />

      <!-- Settings -->
      <MenuNavigationItem
        id="settings"
        :title="$t('APP_SIDEMENU.SETTINGS.TITLE')"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        :can-activate="false"
        icon="settings"
        @click="toggleShowSettings"
      />

      <AppSidemenuNetworkStatus
        v-if="isNetworkStatusVisible"
        :is-horizontal="isHorizontal"
        :outside-click="true"
        @close="closeShowNetworkStatus"
      />
      <!-- Networks -->
      <MenuNavigationItem
        id="networks"
        :title="$t('APP_SIDEMENU.NETWORK')"
        :class="isHorizontal ? 'w-16' : 'h-16'"
        :is-horizontal="isHorizontal"
        :can-activate="false"
        icon="cloud"
        @click="toggleShowNetworkStatus"
      />

      <!-- Profile settings -->
      <div
        :class="isHorizontal ? 'ml-2 mr-4 py-3' : 'mt-2 mb-4 px-3'"
        class="cursor-pointer align-self-end"
      >
        <router-link
          :class="isHorizontal ? 'h-12 w-12 bg-no-repeat' : 'h-18 w-18'"
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
    isHorizontal: {
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
      this.isSettingsVisible = !this.isSettingsVisible
    },

    toggleShowNetworkStatus () {
      this.isNetworkStatusVisible = !this.isNetworkStatusVisible
    },

    closeShowSettings () {
      this.isSettingsVisible = false
    },

    closeShowNetworkStatus () {
      this.isNetworkStatusVisible = false
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
