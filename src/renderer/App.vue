<template>
  <div
    v-if="isReady"
    id="app"
    :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
    :class="{
      'theme-dark': hasDarkTheme,
      'theme-light': !hasDarkTheme,
      'background-image': background
    }"
    class="bg-theme-page text-theme-page-text font-sans flex flex-col px-4 py-6 w-screen h-screen overflow-hidden"
  >

    <div
      :class="{ 'ml-6': !hasAnyProfile }"
      class="flex-1 flex mt-6 mb-4 mr-6"
    >
      <AppSidemenu v-if="hasAnyProfile" />
      <router-view class="flex-1 overflow-y-auto" />
    </div>

    <AppFooter />
    <AlertMessage />
  </div>
</template>

<script>
import '@/styles/style.css'
import { AppSidemenu, AppFooter } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import config from '@config'

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    AppSidemenu,
    AlertMessage
  },

  data: () => ({
    isReady: false
  }),

  computed: {
    background () {
      return this.$store.getters['session/background']
    },
    hasDarkTheme () {
      return this.$store.getters['session/hasDarkTheme']
    },
    hasAnyProfile () {
      return !!this.$store.getters['profile/all'].length
    }
  },

  /**
   * Vue hooks ignore the `async` modifier.
   * The `isReady` property is used here to delay the application while is
   * retrieving the essential data (profile and session) from the database
   */
  async created () {
    await this.loadEssential()

    this.isReady = true

    await this.loadNotEssential()
  },

  methods: {
    /**
     * Loads the profiles and session
     * @return {void}
     */
    async loadEssential () {
      await this.$store.dispatch('network/load', config.NETWORKS)
      await this.$store.dispatch('session/reset')
    },

    /**
     * These data are used in different parts, but loading them should not
     * delay the application
     * @return {void}
     */
    async loadNotEssential () {
      await this.$store.dispatch('timer/start')
      await this.$store.dispatch('market/load')
    }
  }
}
</script>
