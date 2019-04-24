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
          <!-- Updating the maximum number of routes to keep alive means that Vue will destroy the rest of cached route components -->
          <KeepAlive
            :include="keepAliveRoutes"
            :max="keepAliveRoutes.length"
          >
            <RouterView class="flex-1 overflow-y-auto" />
          </KeepAlive>
        </div>

        <AppFooter />
      </section>

      <TransactionModal
        v-if="isUriTransactionOpen"
        :schema="uriSchema"
        :type="0"
        @cancel="closeUriTransaction"
        @sent="closeUriTransaction"
      />

      <WalletSignModal
        v-if="isUriMessageSignOpen"
        :schema="uriSchema"
        @cancel="closeUriMessageSign"
        @signed="closeUriMessageSign"
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
import { isEmpty, pull, uniq } from 'lodash'
import { AppFooter, AppIntro, AppSidemenu } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import { TransactionModal } from '@/components/Transaction'
import { WalletSignModal } from '@/components/Wallet'
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
    TransactionModal,
    WalletSignModal
  },

  data: vm => ({
    isReady: false,
    hasBlurFilter: false,
    uriSchema: {},
    isUriTransactionOpen: false,
    isUriMessageSignOpen: false,
    uriTransactionSchema: {},
    aliveRouteComponents: []
  }),

  keepableRoutes: Object.freeze({
    profileAgnostic: ['Announcements', 'NetworkOverview', 'ProfileAll'],
    profileDependent: ['Dashboard', 'ContactAll', 'WalletAll'],
    // This pages could be cached to not delete the current form data, but they
    // would not support switching profiles, which would be confusing for some users
    dataDependent: ['ContactNew', 'ProfileNew', 'WalletImport', 'WalletNew']
  }),

  computed: {
    background () {
      return this.$store.getters['session/background'] || `wallpapers/${this.hasSeenIntroduction ? 1 : 2}Default.png`
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
    },
    currentProfileId () {
      return this.session_profile
        ? this.session_profile.id
        : null
    },
    keepAliveRoutes () {
      return uniq([
        ...this.$options.keepableRoutes.profileAgnostic,
        ...this.aliveRouteComponents
      ])
    },
    routeComponent () {
      return this.$route.matched.length
        ? this.$route.matched[0].components.default.name
        : null
    }
  },

  watch: {
    hasProtection (value) {
      remote.getCurrentWindow().setContentProtection(value)
    },
    routeComponent (value) {
      if (this.aliveRouteComponents.includes(value)) {
        pull(this.aliveRouteComponents, value)
      }
      // Not all routes can be cached flawlessly
      const keepable = [
        ...this.$options.keepableRoutes.profileAgnostic,
        ...this.$options.keepableRoutes.profileDependent
      ]
      if (keepable.includes(value)) {
        this.aliveRouteComponents.push(value)
      }
    },
    currentProfileId (value, oldValue) {
      if (value && oldValue) {
        // If the profile changes, remove all the cached routes, except the latest
        // if they are profile independent
        if (value !== oldValue) {
          const profileAgnostic = this.$options.keepableRoutes.profileAgnostic

          const aliveRouteComponents = []
          for (let i = profileAgnostic.length; i >= 0; i--) {
            const length = this.aliveRouteComponents.length
            const route = this.aliveRouteComponents[length - i]

            if (profileAgnostic.includes(route)) {
              aliveRouteComponents.push(route)
            }
          }
          this.aliveRouteComponents = aliveRouteComponents
        }
      }
    }
  },

  /**
   * Vue hooks ignore the `async` modifier.
   * The `isReady` property is used here to delay the application while is
   * retrieving the essential data (session and network) from the database
   */
  async created () {
    this.$store._vm.$on('vuex-persist:ready', async () => {
      await this.loadEssential()
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
    async loadEssential () {
      await this.$store.dispatch('network/load', config.NETWORKS)
      const currentProfileId = this.$store.getters['session/profileId']
      await this.$store.dispatch('session/reset')
      await this.$store.dispatch('session/setProfileId', currentProfileId)
      await this.$store.dispatch('ledger/reset')
    },
    /**
     * These data are used in different parts, but loading them should not
     * delay the application
     * TODO move some parts to the synchronizer and make it aware of when the
     * network has changed
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
          this.$store.dispatch('ledger/reloadWallets', { clearFirst: true, forceLoad: true })
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

        if (!uri.validateLegacy() && !uri.validate()) {
          this.$error(this.$t('VALIDATION.INVALID_URI'))
        } else {
          // TODO: handle AIP-13 and AIP-26 options differently
          const deserialized = uri.deserialize()
          switch (deserialized.type) {
            case 'legacy':
              this.openUriTransaction(deserialized)
              break
            case 'add-network':
            case 'transfer':
              this.openUriTransaction(deserialized)
              break
            case 'vote':
            case 'register-delegate':
              console.log(deserialized)
              break
            case 'sign-message':
              this.openUriMessageSign(deserialized)
              // TODO: after signing we should show the page with the signature on it too
              break
          }
        }
      })
    },

    openUriTransaction (schema) {
      this.isUriTransactionOpen = true
      this.uriSchema = schema
    },

    closeUriTransaction () {
      this.isUriTransactionOpen = false
      this.uriSchema = {}
    },

    openUriMessageSign (schema) {
      this.isUriMessageSignOpen = true
      this.uriSchema = schema
    },

    closeUriMessageSign () {
      this.isUriMessageSignOpen = false
      this.uriSchema = {}
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
