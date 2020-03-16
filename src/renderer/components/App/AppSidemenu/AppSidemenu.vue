<template>
  <MenuNavigation
    v-model="activeItem"
    :class="{
      'AppSidemenu--horizontal': isHorizontal,
      'AppSidemenu--vertical mr-3 lg:mx-6': !isHorizontal
    }"
    class="AppSidemenu"
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

          <!-- Plugin Manager -->
          <MenuNavigationItem
            id="plugin-manager"
            :title="$t('APP_SIDEMENU.PLUGIN_MANAGER')"
            :is-horizontal="isHorizontal"
            :can-activate="false"
            class="AppSidemenu__item"
            icon="manage-plugins"
            @click="redirect($event)"
          />

          <!-- Plugin pages -->
          <MenuNavigationItem
            v-if="hasPluginMenuItems"
            id="plugin-pages"
            :title="$t('APP_SIDEMENU.PLUGINS_PAGES')"
            :is-horizontal="isHorizontal"
            :can-activate="false"
            class="AppSidemenu__item"
            icon="my-plugins"
            @click="toggleShowPluginMenu"
          />

          <AppSidemenuPlugins
            v-if="hasPluginMenuItems && isPluginMenuVisible"
            :outside-click="true"
            :is-horizontal="isHorizontal"
            @close="closeShowPlugins"
          />
        </div>

        <div class="flexify">
          <!-- Important notification / new releases -->
          <AppSidemenuImportantNotification
            v-if="isImportantNotificationVisible && hasAvailableRelease"
            :is-horizontal="isHorizontal"
            class="AppSidemenu__item"
            @close="hideImportantNotification"
          />
        </div>

        <div class="flexify">
          <AppSidemenuSettings
            ref="settings"
            :outside-click="true"
            :is-horizontal="isHorizontal"
          />

          <AppSidemenuNetworkStatus
            :is-horizontal="isHorizontal"
            :outside-click="true"
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
                  'h-12 w-12': hasStandardAvatar && isHorizontal,
                  'h-18 w-18': hasStandardAvatar && !isHorizontal
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
import { mapGetters } from 'vuex'
import AppSidemenuPlugins from './AppSidemenuPlugins'
import AppSidemenuSettings from './AppSidemenuSettings'
import AppSidemenuNetworkStatus from './AppSidemenuNetworkStatus'
import AppSidemenuImportantNotification from './AppSidemenuImportantNotification'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import { ProfileAvatar } from '@/components/Profile'
import SvgIcon from '@/components/SvgIcon'
import { ipcRenderer } from 'electron'

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
    isImportantNotificationVisible: true,
    isPluginMenuVisible: false,
    activeItem: vm.$route.name
  }),

  computed: {
    ...mapGetters({
      hasAvailableRelease: 'updater/hasAvailableRelease',
      unreadAnnouncements: 'announcements/unread'
    }),
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

  created () {
    ipcRenderer.on('app:preferences', () => {
      this.$refs.settings.showSettings()
    })
  },

  methods: {
    redirect (name) {
      this.setActive(name)
      this.$router.push({ name })
    },

    setActive (name) {
      this.activeItem = name
    },

    hideImportantNotification () {
      this.isImportantNotificationVisible = false
    },

    toggleShowPluginMenu () {
      this.isPluginMenuVisible = !this.isPluginMenuVisible
    },

    closeShowPlugins (setActive) {
      if (setActive) {
        this.setActive('plugin-pages')
      }

      this.isPluginMenuVisible = false
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenu { @apply relative bg-transparent }
.AppSidemenu__container__scrollable .flexify { @apply flex-none }
.AppSidemenu__logo { transition: opacity 0.5s; }

.AppSidemenu__avatar__container {
  transition: opacity 0.5s;
}

.AppSidemenu--horizontal { @apply h-full }
.AppSidemenu--horizontal .flexify { @apply flex flex-row }
.AppSidemenu--horizontal .AppSidemenu__container { @apply bg-theme-feature }
.AppSidemenu--horizontal .AppSidemenu__item { @apply w-16 h-full }
.AppSidemenu--horizontal .AppSidemenu__logo { @apply p-4 }
.AppSidemenu--horizontal .AppSidemenu__logo img { @apply h-12 }
.AppSidemenu--horizontal .AppSidemenu__avatar__dots {
  @apply absolute p-2 rounded-full bg-theme-feature;
  right: 0.1rem;
  bottom: 0.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

.AppSidemenu--vertical { @apply w-22 h-full rounded-lg }
.AppSidemenu--vertical .flexify { @apply flex flex-col }
.AppSidemenu--vertical .AppSidemenu__container__scrollable { @apply rounded-lg py-2 }
.AppSidemenu--vertical .AppSidemenu__item { @apply h-16 }
.AppSidemenu--vertical .AppSidemenu__logo { @apply rounded-lg mb-3 p-5 }
.AppSidemenu--vertical .AppSidemenu__logo img { @apply w-18 }
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
