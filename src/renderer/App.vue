<template>
  <div
    v-if="isReady"
    id="app"
    :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
    :class="{
      'theme-dark': useDarkTheme,
      'theme-light': !useDarkTheme,
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
import timerService from '@/services/timer-service'
import MarketDataService from '@/services/market-data-service'

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
    useDarkTheme () {
      return this.$store.getters['session/theme'] === 'dark'
    },
    hasAnyProfile () {
      return !!this.$store.getters['profiles/all'].length
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
    this.startTimers()
  },

  async beforeDestroy () {
    timerService.stop(MarketDataService.timerName)
  },

  async destroyed () {
    await this.$store.dispatch('session/reset')
  },

  methods: {
    /**
     * Loads the profiles and session
     * @return {void}
     */
    async loadEssential () {
      await this.$store.dispatch('profiles/load')
      await this.$store.dispatch('network/setDefaults', config.NETWORKS)
      await this.$store.dispatch('session/load')
      await this.$store.dispatch('session/ensure')
      // Reset the session now: the async nature of IndexedDB means that maybe
      // it wasn't reset during the `destroyed` hook
      await this.$store.dispatch('session/reset')
    },

    /**
     * These data are used in different parts, but loading them should not
     * delay the application
     * @return {void}
     */
    loadNotEssential () {
    },

    startTimers () {
      this.$store.dispatch('marketData/load')

      timerService.start(MarketDataService.timerName, () => {
        this.$store.dispatch('marketData/sync')
      }, 60000)
    }
  }
}
</script>
