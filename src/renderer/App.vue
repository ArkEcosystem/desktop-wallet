<template>
  <div
    v-if="isReady"
    id="app"
    :class="{
      'theme-dark': hasDarkTheme,
      'theme-light': !hasDarkTheme,
      'background-image': background
    }"
    class="App bg-theme-page text-theme-page-text font-sans"
  >
    <AppSidemenu
      v-if="hasAnyProfile"
      :horizontal="true"
      class="flex lg:hidden"
    />
    <section
      :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
      :class="{
        'blur': isModalOpen
      }"
      class="App__main flex flex-col px-4 py-6 w-screen h-screen overflow-hidden"
    >
      <div
        :class="{ 'ml-6': !hasAnyProfile }"
        class="flex-1 flex mt-6 mb-4 mr-6"
      >
        <AppSidemenu
          v-if="hasAnyProfile"
          class="hidden lg:flex"
        />
        <router-view class="flex-1 overflow-y-auto" />
      </div>

      <AppFooter/>
    </section>

    <portal-target
      name="modal"
      @change="onPortalChange"
    />
    <portal-target
      name="loading"
      @change="onPortalChange"
    />

    <AlertMessage />
  </div>
</template>

<script>
import '@/styles/style.css'
import { isEmpty } from 'lodash'
import { AppSidemenu, AppFooter } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import config from '@config'

var { remote } = require('electron')

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    AppSidemenu,
    AlertMessage
  },

  data: () => ({
    isReady: false,
    isModalOpen: false
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
    },
    hasProtection () {
      return this.$store.getters['session/contentProtection']
    }
  },

  watch: {
    hasProtection (value) {
      remote.getCurrentWindow().setContentProtection(value)
    }
  },

  /**
   * Vue hooks ignore the `async` modifier.
   * The `isReady` property is used here to delay the application while is
   * retrieving the essential data (session and network) from the database
   */
  async created () {
    await this.$store.dispatch('network/load', config.NETWORKS)
    this.$store._vm.$on('vuex-persist:ready', async () => {
      await this.$store.dispatch('session/reset')

      this.isReady = true

      this.$synchronizer.defineAll()
      this.$synchronizer.ready()

      await this.loadNotEssential()
    })

    remote.getCurrentWindow().setContentProtection(this.hasProtection)
  },

  methods: {
    /**
     * These data are used in different parts, but loading them should not
     * delay the application
     * @return {void}
     */
    async loadNotEssential () {
      await this.$store.dispatch('timer/start')
      await this.$store.dispatch('peer/refresh')
      this.$store.dispatch('peer/connectToBest', {})
      this.$store.dispatch('timer/subscribe', {
        interval: 'medium',
        callback: async () => this.$store.dispatch('peer/updateCurrentPeerStatus'),
        immediate: true
      })

      if (this.session_network) {
        this.$store.dispatch('ledger/init', this.session_network.slip44)
      }

      this.$eventBus.on('client:changed', () => {
        this.$store.dispatch('ledger/init', this.session_network.slip44)
        this.$store.dispatch('peer/connectToBest', {})
      })
      this.$eventBus.on('ledger:connected', async () => {
        this.$success('Ledger Connected!')
      })
      this.$eventBus.on('ledger:disconnected', async () => {
        this.$warn('Ledger Disconnected!')
      })
    },

    onPortalChange (options) {
      this.isModalOpen = !isEmpty(options)
    }
  }
}
</script>

<style scoped>
.blur {
  filter: blur(4px)
}

.App__main {
  transition: .1s filter linear;
}
</style>
