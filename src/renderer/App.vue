<template>
  <div
    v-if="isReady"
    id="app"
    :class="{
      'theme-dark': session_hasDarkTheme,
      'theme-light': !session_hasDarkTheme,
      'background-image': background,
      windows: isWindows,
      mac: isMac,
      linux: isLinux
    }"
    class="App bg-theme-page text-theme-page-text font-sans"
  >
    <AppWelcome
      v-if="!hasSeenIntroduction"
      @done="setIntroDone"
    />

    <div v-else>
      <AppSidemenu
        v-if="hasAnyProfile"
        :is-horizontal="true"
        class="flex lg:hidden"
      />
      <section
        :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
        :class="{
          'blur': hasBlurFilter
        }"
        class="App__main flex flex-col items-center px-4 lg:py-6 w-screen h-screen overflow-hidden"
      >
        <div
          :class="{ 'ml-6': !hasAnyProfile }"
          class="App__container w-full flex-1 flex mt-6 mb-4 lg:mr-6"
        >
          <AppSidemenu
            v-if="hasAnyProfile"
            class="hidden lg:flex"
          />
          <router-view class="flex-1 overflow-y-auto" />
        </div>

        <AppFooter />
      </section>

      <portal-target
        name="modal"
        multiple
        @change="onPortalChange"
      />

      <portal-target
        name="loading"
        @change="onPortalChange"
      />

      <portal-target
        name="qr-scan"
        @change="onPortalChange"
      />

      <AlertMessage />
    </div>
  </div>
</template>

<script>
import '@/styles/style.css'
import { isEmpty } from 'lodash'
import { AppSidemenu, AppFooter, AppWelcome } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import config from '@config'
import URIHandler from '@/services/uri-handler'

var { remote, ipcRenderer } = require('electron')

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    AppSidemenu,
    AppWelcome,
    AlertMessage
  },

  data: () => ({
    isReady: false,
    hasBlurFilter: false
  }),

  computed: {
    background () {
      return this.$store.getters['session/background'] || 'wallpapers/1Default.png'
    },
    hasAnyProfile () {
      return !!this.$store.getters['profile/all'].length
    },
    hasProtection () {
      return this.$store.getters['session/contentProtection']
    },
    hasSeenIntroduction () {
      return this.$store.getters['app/hasSeenIntroduction']
    },
    isWindows () {
      return process.platform === 'win32'
    },
    isMac () {
      return process.platform === 'darwin'
    },
    isLinux () {
      return ['freebsd', 'linux', 'sunos'].includes(process.platform)
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
      const currentProfileId = this.$store.getters['session/profileId']
      await this.$store.dispatch('session/reset')
      await this.$store.dispatch('session/load', currentProfileId)

      this.isReady = true

      this.$synchronizer.defineAll()
      this.$synchronizer.ready()

      await this.loadNotEssential()
    })

    remote.getCurrentWindow().setContentProtection(this.hasProtection)
  },

  mounted () {
    this.__watchProcessURL()
  },

  methods: {
    /**
     * These data are used in different parts, but loading them should not
     * delay the application
     * @return {void}
     */
    async loadNotEssential () {
      await this.$store.dispatch('peer/refresh')
      this.$store.dispatch('peer/connectToBest', {})

      if (this.session_network) {
        this.$store.dispatch('ledger/init', this.session_network.slip44)
        this.$store.dispatch('delegate/load')
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

      try {
        await this.$store.dispatch('app/checkNewVersion')
      } catch (error) {
        this.$error(this.$t('APP.RELEASE.REQUEST_ERROR'))
      }
    },

    onPortalChange (options) {
      this.hasBlurFilter = !isEmpty(options)
    },

    __watchProcessURL () {
      ipcRenderer.on('process-url', (_, url) => {
        const currentWallet = this.wallet_fromRoute
        const isWalletActive = !!currentWallet
        const uri = new URIHandler(url)

        if (!uri.validate()) {
          this.$error(this.$t('VALIDATION.INVALID_URI'))
        } else if (!isWalletActive) {
          this.$error(this.$t('VALIDATION.WALLET_NOT_ACTIVE'))
        } else {
          this.$eventBus.emit('wallet:open-send-transfer', uri.deserialize())
        }
      })
    },

    setIntroDone () {
      this.$store.dispatch('app/setHasSeenIntroduction', true)
      this.$router.push({ name: 'profile-new' })
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
.App__container {
  max-width: 1400px;
}
</style>
