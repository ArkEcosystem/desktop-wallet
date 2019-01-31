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
    <div
      v-if="!hasSeenIntroduction"
      :style="`backgroundImage: url('${assets_loadImage(background)}')`"
      class="px-20 py-16 w-screen h-screen relative"
    >
      <AppIntro
        @done="setIntroDone"
      />
      <!-- FIXME -->
      <AppFooter
        class="mt-4"
      />
    </div>

    <div
      v-else
      class="overflow-hidden"
    >
      <AppSidemenu
        v-if="hasAnyProfile"
        :is-horizontal="true"
        :class="{
          'blur': hasBlurFilter
        }"
        class="block md:hidden z-1"
      />
      <section
        :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
        :class="{
          'blur': hasBlurFilter
        }"
        class="App__main flex flex-col items-center px-6 pb-6 pt-2 lg:pt-6 w-screen-adjusted h-screen-adjusted overflow-hidden -m-2"
      >
        <div
          :class="{ 'ml-6': !hasAnyProfile }"
          class="App__container w-full flex-1 flex mt-4 mb-4 lg:mr-6"
        >
          <AppSidemenu
            v-if="hasAnyProfile"
            class="hidden md:block"
          />
          <RouterView class="flex-1 overflow-y-auto" />
        </div>

        <AppFooter />
      </section>

      <TransactionModal
        v-if="isUriTransactionOpen"
        :schema="uriTransactionSchema"
        :type="0"
        @cancel="closeUriTransaction"
        @sent="closeUriTransaction"
      />

      <PortalTarget
        name="modal"
        multiple
        @change="onPortalChange"
      />

      <PortalTarget
        name="loading"
        @change="onPortalChange"
      />

      <PortalTarget
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
import { AppFooter, AppIntro, AppSidemenu } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import { TransactionModal } from '@/components/Transaction'
import config from '@config'
import URIHandler from '@/services/uri-handler'

var { remote, ipcRenderer } = require('electron')
const Menu = remote.Menu

export default {
  name: 'DesktopWallet',

  components: {
    AppFooter,
    AppIntro,
    AppSidemenu,
    AlertMessage,
    TransactionModal
  },

  data: () => ({
    isReady: false,
    hasBlurFilter: false,
    isUriTransactionOpen: false,
    uriTransactionSchema: {}
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
    this.$store._vm.$on('vuex-persist:ready', async () => {
      await this.$store.dispatch('network/load', config.NETWORKS)
      const currentProfileId = this.$store.getters['session/profileId']
      await this.$store.dispatch('session/reset')
      await this.$store.dispatch('session/setProfileId', currentProfileId)
      await this.$store.dispatch('ledger/reset')

      this.isReady = true

      this.$synchronizer.defineAll()

      await this.loadNotEssential()

      this.$synchronizer.ready()

      // Environments variables are strings
      const status = process.env.ENABLE_SCREENSHOT_PROTECTION
      if (status) {
        // We only set this if the env variable is 'false', since protection defaults to true
        // Since it's not a boolean, we can't do status !== false, since that would disable protection with every env var that's not 'true'
        this.$store.dispatch('session/setContentProtection', !(status === 'false'))
      } else {
        remote.getCurrentWindow().setContentProtection(true)
      }
    })

    this.setContextMenu()
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
        this.$store.dispatch('delegate/load')
        if (this.$store.getters['ledger/isConnected']) {
          this.$store.dispatch('ledger/reloadWallets', true)
        }
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
        const uri = new URIHandler(url)

        if (!uri.validate()) {
          this.$error(this.$t('VALIDATION.INVALID_URI'))
        } else {
          this.openUriTransaction(uri.deserialize())
        }
      })
    },

    openUriTransaction (schema) {
      this.isUriTransactionOpen = true
      this.uriTransactionSchema = schema
    },

    closeUriTransaction () {
      this.isUriTransactionOpen = false
      this.uriTransactionSchema = {}
    },

    setIntroDone () {
      this.$store.dispatch('app/setHasSeenIntroduction', true)
      this.$router.push({ name: 'profile-new' })
    },

    // Enable contextmenu (right click) on input / textarea fields
    setContextMenu () {
      const InputMenu = Menu.buildFromTemplate([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { role: 'selectall' }
      ])

      document.body.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()

        let node = e.target

        while (node) {
          if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            InputMenu.popup(remote.getCurrentWindow())
            break
          }
          node = node.parentNode
        }
      })
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
.App__main.h-screen-adjusted {
  height: calc(100vh + 1rem);
}
.App__main.w-screen-adjusted {
  width: calc(100vw + 1rem);
}
</style>
