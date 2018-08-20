<template>
  <div
    id="app"
    :class="[
      darkTheme ? 'theme-dark' : 'theme-light',
      'bg-theme-page font-sans'
    ]"
    class="flex flex-col px-4 w-screen h-screen"
  >

    <div class="flex-1 flex my-6">
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

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    Sidemenu
  },

  data: () => ({
    darkTheme: false
  })
}
</script>
