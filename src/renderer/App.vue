<template>
  <div
    id="app"
    :class="darkTheme ? 'theme-dark' : 'theme-light'"
    class="bg-theme-page text-theme-page-text font-sans flex flex-col px-4 py-6 w-screen h-screen overflow-hidden"
  >

    <div
      :class="{ 'ml-6': !hasAnyProfile }"
      class="flex-1 flex mt-6 mb-4 mr-6"
    >
      <AppSidemenu v-if="hasAnyProfile" />
      <router-view class="flex-1" />
    </div>

    <AppFooter />
  </div>
</template>

<script>
import '@/styles/style.css'
import AppFooter from '@/components/AppFooter'
import AppSidemenu from '@/components/AppSidemenu'
import config from '@config'
import timerService from '@/services/timer-service'
import MarketDataService from '@/services/market-data-service'

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    AppSidemenu
  },

  data: () => ({
    darkTheme: false
  }),

  computed: {
    hasAnyProfile () {
      return !!this.$store.getters['profiles/all'].length
    }
  },

  async created () {
    this.$store.dispatch('network/setDefaults', config.NETWORKS)
    await this.$store.dispatch('session/load')
    await this.$store.dispatch('session/ensure')
    await this.$store.dispatch('marketData/load')
    timerService.start(MarketDataService.timerName, () => {
      this.$store.dispatch('marketData/sync')
    }, 60000)
  },

  beforeDestroy () {
    timerService.stop(MarketDataService.timerName)
  }
}
</script>
