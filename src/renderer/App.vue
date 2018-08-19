<template>
  <div
    id="app"
    :class="[
      darkTheme ? 'theme-dark' : 'theme-light',
      'bg-theme-page-background-color'
    ]"
    class="flex flex-col px-4 w-screen h-screen"
  >

    <div class="flex">
      <Sidemenu/>
      <router-view/>
    </div>

    <Footer/>
  </div>
</template>

<script>
import '@/styles/style.css'
import Footer from '@/components/layout/Footer'
import Sidemenu from '@/components/layout/Sidemenu'

export default {
  name: 'DesktopWallet',
  components: {
    Footer, Sidemenu
  },
  data: () => ({
    darkTheme: false
  })
}
</script>
