<template>
  <div
    id="app"
    :class="[
      darkTheme ? 'theme-dark' : 'theme-light',
      'bg-theme-page-background-color'
    ]"
    class="flex flex-col px-4"
  >

    <div class="flex">
      <Sidemenu/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import '@/styles/style.css'
import Sidemenu from '@/components/layout/Sidemenu'

export default {
  name: 'DesktopWallet',
  components: {
    Sidemenu
  },
  data: () => ({
    darkTheme: false
  })
}
</script>
