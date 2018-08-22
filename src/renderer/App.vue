<template>
  <div
    id="app"
    :class="[
      darkTheme ? 'theme-dark' : 'theme-light',
      'bg-theme-page text-theme-page-text font-sans flex flex-col px-4 py-6 w-screen h-screen'
    ]"
  >

    <div class="flex-1 flex">
      <sidemenu />
      <router-view class="flex-1" />
    </div>

    <app-footer />
  </div>
</template>

<script>
import '@/styles/style.css'
import AppFooter from '@/components/layout/app-footer'
import Sidemenu from '@/components/layout/sidemenu'
import config from '@config'

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    Sidemenu
  },

  data: () => ({
    darkTheme: false
  }),

  async created () {
    this.$store.dispatch('network/setDefaults', config.NETWORKS)
  }
}
</script>
