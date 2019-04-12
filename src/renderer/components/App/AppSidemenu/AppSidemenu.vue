<template>
  <MenuNavigation
    v-model="activeItem"
    :class="{
      'AppSidemenu--horizontal': isHorizontal,
      'AppSidemenu--vertical': !isHorizontal
    }"
    class="AppSidemenu relative bg-transparent"
  >
    <div
      class="AppSidemenu__container flexify w-full md:h-full justify-between"
    >
      <!-- ARK logo -->
      <RouterLink
        :title="$t('APP_SIDEMENU.DASHBOARD')"
        :to="{ name: 'dashboard' }"
        class="AppSidemenu__logo bg-red hover:opacity-85 flex justify-center items-center"
        @click.native="redirect('dashboard')"
      >
        <img src="@/assets/images/ark-logo.png">
      </RouterLink>

      <div class="AppSidemenu__container__scrollable flex-1 overflow-y-auto flexify justify-between bg-theme-feature">
        <div class="flexify">
          <!-- Wallets -->
          <MenuNavigationItem
            id="wallets"
            :title="$t('APP_SIDEMENU.WALLETS')"
            :is-horizontal="isHorizontal"
            class="AppSidemenu__item"
            icon="wallet"
            @click="redirect($event)"
          />

          <!-- Add contact -->
          <MenuNavigationItem
            id="contacts"
            :title="$t('APP_SIDEMENU.CONTACTS')"
            :is-horizontal="isHorizontal"
            class="AppSidemenu__item"
            icon="contact-add"
            @click="redirect($event)"
          />

          <!-- Announcements -->
          <MenuNavigationItem
            id="announcements"
            :title="$t('APP_SIDEMENU.ANNOUNCEMENTS')"
            class="AppSidemenu__item"
            :is-horizontal="isHorizontal"
            :show-badge="showUnread"
            icon="whitepaper"
            @click="redirect($event)"
          />

          <!-- Plugins -->
          <MenuNavigationItem
            id="plugins"
            :title="$t('APP_SIDEMENU.PLUGINS')"
            :is-horizontal="isHorizontal"
            :can-activate="false"
            class="AppSidemenu__item"
            icon="plugins"
            @click="redirect($event)"
          />

          <AppSidemenuPlugins
            v-if="hasPluginMenuItems && isPluginsVisible"
            :outside-click="true"
            :is-horizontal="isHorizontal"
            @close="closeShowPlugins"
          />
        </div>

        <div class="flexify">
          <!-- Important notification / new releases -->
          <AppSidemenuImportantNotification
            v-if="isImportantNotificationVisible && hasNewRelease"
            :is-horizontal="isHorizontal"
            class="AppSidemenu__item"
            @close="hideImportantNotification"
          />
        </div>

        <div class="flexify">
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
            :is-horizontal="isHorizontal"
            :can-activate="false"
            class="AppSidemenu__item"
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
            :is-horizontal="isHorizontal"
            :can-activate="false"
            class="AppSidemenu__item"
            icon="cloud"
            @click="toggleShowNetworkStatus"
          />

          <!-- Profile settings -->
          <div
            :class="isHorizontal ? 'ml-2 mr-4 py-3' : 'mt-2 mb-4 px-3'"
            class="AppSidemenu__avatar__container relative cursor-pointer flex items-center justify-center hover:opacity-50"
          >
            <RouterLink
              :to="{ name: 'profiles' }"
              class="AppSidemenu__avatar"
            >
              <ProfileAvatar
                :profile="session_profile"
                :class="{
                  'h-12 w-12': session_profile.avatar && isHorizontal,
                  'h-18 w-18': session_profile.avatar && !isHorizontal
                }"
                :title="$t('APP_SIDEMENU.CURRENT_PROFILE', { profileName: session_profile.name })"
                letter-size="xl"
              >
                <SvgIcon
                  class="AppSidemenu__avatar__dots text-grey-dark"
                  name="point"
                  view-box="0 0 14 14"
                />
              </ProfileAvatar>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </MenuNavigation>
</template>

<script>
import semver from 'semver'
import { mapGetters } from 'vuex'
import releaseService from '@/services/release'
import AppSidemenuPlugins from './AppSidemenuPlugins'
import AppSidemenuSettings from './AppSidemenuSettings'
import AppSidemenuNetworkStatus from './AppSidemenuNetworkStatus'
import AppSidemenuImportantNotification from './AppSidemenuImportantNotification'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import { ProfileAvatar } from '@/components/Profile'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppSidemenu',

  components: {
    AppSidemenuPlugins,
    AppSidemenuSettings,
    AppSidemenuNetworkStatus,
    AppSidemenuImportantNotification,
    MenuNavigation,
    MenuNavigationItem,
    ProfileAvatar,
    SvgIcon
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
    isPluginsVisible: false,
    isSettingsVisible: false,
    activeItem: vm.$route.name
  }),

  computed: {
    ...mapGetters({
      latestReleaseVersion: 'app/latestReleaseVersion',
      unreadAnnouncements: 'announcements/unread'
    }),
    hasNewRelease () {
      return semver.lt(releaseService.currentVersion, this.latestReleaseVersion || releaseService.currentVersion)
    },
    showUnread () {
      return this.unreadAnnouncements.length > 0
    },
    hasPluginMenuItems () {
      return this.$store.getters['plugin/menuItems'].length
    },
    hasStandardAvatar () {
      return this.session_profile.avatar && typeof this.session_profile.avatar === 'string'
    },
    pluginAvatar () {
      if (this.session_profile.avatar && this.session_profile.avatar.pluginId) {
        return this.$store.getters['plugin/avatar'](this.session_profile.avatar)
      }

      return null
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

    toggleShowPlugins () {
      this.isPluginsVisible = !this.isPluginsVisible
    },

    toggleShowSettings () {
      this.isSettingsVisible = !this.isSettingsVisible
    },

    toggleShowNetworkStatus () {
      this.isNetworkStatusVisible = !this.isNetworkStatusVisible
    },

    closeShowPlugins () {
      this.isPluginsVisible = false
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

<style lang="postcss" scoped>
.AppSidemenu__container__scrollable .flexify { @apply flex-none }
.AppSidemenu__logo { transition: opacity 0.5s; }

.AppSidemenu__avatar__container {
  transition: opacity 0.5s;
}

.AppSidemenu--horizontal .AppSidemenu__item { @apply w-16 }
.AppSidemenu--horizontal .AppSidemenu__logo { @apply p-4 }
.AppSidemenu--horizontal .AppSidemenu__logo img { @apply h-12 }
.AppSidemenu--horizontal .flexify { @apply flex flex-row }
.AppSidemenu--horizontal { @apply h-18; }
.AppSidemenu--horizontal .AppSidemenu__avatar__dots {
  @apply absolute p-2 rounded-full bg-theme-feature;
  right: 0.1rem;
  bottom: 0.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

.AppSidemenu--vertical .AppSidemenu__container__scrollable { @apply rounded-lg py-2 }
.AppSidemenu--vertical .AppSidemenu__item { @apply h-16 }
.AppSidemenu--vertical .AppSidemenu__logo { @apply rounded-lg mb-3 p-5 }
.AppSidemenu--vertical .AppSidemenu__logo img { @apply w-18 }
.AppSidemenu--vertical .flexify { @apply flex flex-col }
.AppSidemenu--vertical { @apply w-22 mx-6 rounded-lg }
.AppSidemenu--vertical .AppSidemenu__avatar__dots {
  @apply absolute p-2 rounded-full bg-theme-feature shadow;
  right: 1rem;
  bottom: -0.7rem;
  width: 1.8rem;
  height: 1.8rem;
}

.AppSidemenu__avatar__container .ProfileAvatar__image__component {
  @apply .h-18 .w-18;
}
</style>
