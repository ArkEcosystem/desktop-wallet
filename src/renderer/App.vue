<template>
  <div
    v-if="isReady"
    id="app"
    :class="[themeClass, {
      'background-image': background,
      windows: isWindows,
      mac: isMac,
      linux: isLinux
    }]"
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
          class="App__container w-full h-full flex mt-4 mb-4 lg:mr-6"
        >
          <div
            class="hidden md:flex flex-col"
          >
            <AppBackButton
              v-if="hasAnyProfile && isWalletPage"
              class="mb-4 block"
            />

            <AppSidemenu
              v-if="hasAnyProfile"
              class="flex flex-1"
            />
          </div>

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
import fs from 'fs'
import CleanCss from 'clean-css'
import { isEmpty, pull, uniq } from 'lodash'
import { AppBackButton, AppFooter, AppIntro, AppSidemenu } from '@/components/App'
import AlertMessage from '@/components/AlertMessage'
import { TransactionModal } from '@/components/Transaction'
import config from '@config'
import URIHandler from '@/services/uri-handler'

var { remote, ipcRenderer } = require('electron')
const Menu = remote.Menu

export default {
  name: 'DesktopWallet',

  components: {
    AppBackButton,
    AppFooter,
    AppIntro,
    AppSidemenu,
    AlertMessage,
    TransactionModal
  },

  data: vm => ({
    isReady: false,
    hasBlurFilter: false,
    isUriTransactionOpen: false,
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
    isWalletPage () {
      return this.$route.matched.length
        ? this.$route.matched[0].components.default.name === 'WalletShow'
        : null
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
    },
    pluginThemes () {
      return this.$store.getters['plugin/themes']
    },
    theme () {
      const theme = this.$store.getters['session/theme']
      const defaultThemes = ['light', 'dark']

      // Ensure that the plugin theme is available (not deleted from the file system)
      return defaultThemes.includes(theme) || this.pluginThemes[theme]
        ? theme
        : defaultThemes[0]
    },
    themeClass () {
      return `theme-${this.theme}`
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
    },
    pluginThemes (value, oldValue) {
      this.applyPluginTheme(this.theme)
    },
    theme (value, oldValue) {
      this.applyPluginTheme(value)
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
      // We need to await plugins in order for all plugins to load properly
      await this.$plugins.init(this)
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
    },

    /**
     * Webpack cannot require assets without knowing the path or, at least, part of it
     * (https://webpack.js.org/guides/dependency-management/#require-context), so,
     * instead of that, those assets are loaded manually and then injected directly on the DOM.
     */
    applyPluginTheme (themeName) {
      if (themeName && this.pluginThemes) {
        const theme = this.pluginThemes[themeName]
        if (theme) {
          const $style = document.querySelector('style[name=plugins]')
          const input = fs.readFileSync(theme.cssPath)
          const output = new CleanCss().minify(input)
          $style.innerHTML = output.styles
        }
      }
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
