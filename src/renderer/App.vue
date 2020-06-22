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
        v-if="hasProfile"
        :is-horizontal="true"
        class="block md:hidden z-1"
      />
      <section
        :style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
        class="App__main flex flex-col items-center px-4 pb-4 lg:pt-4 w-screen h-screen-adjusted overflow-hidden"
      >
        <div
          :class="{ 'ml-6': !hasProfile }"
          class="App__container w-full h-full flex mt-4 mb-4 lg:mr-6"
        >
          <div
            class="hidden md:flex flex-col"
          >
            <AppSidemenu
              v-if="hasProfile"
              class="flex flex-1"
            />
          </div>

          <!-- Updating the maximum number of routes to keep alive means that Vue will destroy the rest of cached route components -->
          <KeepAlive
            :include="keepAliveRoutes"
            :max="keepAliveRoutes.length"
          >
            <RouterView class="App__page flex-1 overflow-y-auto" />
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
      />

      <PortalTarget name="updater" />

      <PortalTarget name="loading" />

      <PortalTarget name="qr-scan" />

      <PortalTarget
        name="button-dropdown"
        multiple
      />

      <AlertMessage />
    </div>
  </div>
</template>

<script>
import '@/styles/style.css'
import fs from 'fs'
import CleanCss from 'clean-css'
import { remote, ipcRenderer } from 'electron'
import { pull, uniq } from 'lodash'
import { AppFooter, AppIntro, AppSidemenu } from '@/components/App'
import { I18N } from '@config'
import AlertMessage from '@/components/AlertMessage'
import { TransactionModal } from '@/components/Transaction'
import URIHandler from '@/services/uri-handler'
import priceApi from '@/services/price-api'
import i18nSetup from '@/i18n/i18n-setup'

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
    isUriTransactionOpen: false,
    uriTransactionSchema: {},
    aliveRouteComponents: [],
    onLineStatus: window.navigator.onLine || false
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
    hasProfile () {
      return !!this.$store.getters['session/profile']
    },
    hasScreenshotProtection () {
      return this.$store.getters['session/screenshotProtection']
    },
    isScreenshotProtectionEnabled: {
      get () {
        return this.$store.getters['app/isScreenshotProtectionEnabled']
      },
      set (protection) {
        this.$store.dispatch('app/setIsScreenshotProtectionEnabled', protection)
      }
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
    },
    pluginLanguages () {
      return this.$store.getters['plugin/languages']
    },
    language () {
      const language = this.$store.getters['session/language']
      const defaultLocale = I18N.defaultLocale

      // Ensure that the plugin language is available (not deleted from the file system)
      return defaultLocale === language || this.pluginLanguages[language]
        ? language
        : defaultLocale
    }
  },

  watch: {
    hasScreenshotProtection (value) {
      if (this.isScreenshotProtectionEnabled) {
        remote.getCurrentWindow().setContentProtection(value)
      }
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
    pluginThemes () {
      this.applyPluginTheme(this.theme)
    },
    theme (value) {
      this.applyPluginTheme(value)
    },
    pluginLanguages () {
      this.applyPluginLanguage(this.language)
    },
    language (value) {
      this.applyPluginLanguage(value)
    },
    onLineStatus (connected) {
      if (connected) {
        this.$success(this.$t('COMMON.INTERNET_STATUS.WITH_INTERNET_CONNECTION'))
      } else {
        this.$error(this.$t('COMMON.INTERNET_STATUS.NO_INTERNET_CONNECTION'))
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
      // Environments variables are strings
      this.isScreenshotProtectionEnabled = process.env.ENABLE_SCREENSHOT_PROTECTION !== 'false'

      await this.loadEssential()
      this.isReady = true

      this.$synchronizer.defineAll()

      await this.loadNotEssential()

      this.$synchronizer.ready()
    })

    this.setContextMenu()

    this.__watchProfile()
  },

  mounted () {
    this.__watchProcessURL()
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },

  methods: {
    updateOnlineStatus (event) {
      this.onLineStatus = event.type === 'online'
    },

    async loadEssential () {
      // We need to await plugins in order for all plugins to load properly
      try {
        await this.$plugins.init(this)
      } catch {
        this.$error('Failed to load plugins. NPM might be down.')
      }

      await this.$store.dispatch('network/load')
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
      ipcRenderer.send('updater:check-for-updates')
      await this.$store.dispatch('peer/refresh')
      this.$store.dispatch('peer/connectToBest', {})
      await this.$store.dispatch('network/updateData')

      if (this.session_network) {
        this.$store.dispatch('ledger/init', this.session_network.slip44)
        this.$store.dispatch('delegate/load')
      }

      this.$eventBus.on('client:changed', async () => {
        this.$store.dispatch('peer/connectToBest', {})
        this.$store.dispatch('network/updateData')
        this.$store.dispatch('delegate/load')
        await this.$store.dispatch('ledger/init', this.session_network.slip44)
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

      ipcRenderer.send('splashscreen:app-ready')

      try {
        await Promise.all([this.$plugins.fetchPluginsFromAdapter(), this.$plugins.fetchPluginsList()])
      } catch {
        this.$error('Failed to load plugins. NPM might be down.')
      }
    },

    __watchProfile () {
      this.$store.watch(
        (_, getters) => getters['session/profile'],
        async (profile, oldProfile) => {
          if (!profile) {
            return
          }

          const currentPeer = this.$store.getters['peer/current']()
          if (currentPeer && currentPeer.ip) {
            const scheme = currentPeer.isHttps ? 'https://' : 'http://'
            this.$client.host = `${scheme}${currentPeer.ip}:${currentPeer.port}`
          }

          if (!oldProfile || profile.id !== oldProfile.id) {
            this.$eventBus.emit('client:changed')
          }

          priceApi.setAdapter(profile.priceApi)

          this.$store.dispatch('market/refreshTicker')
        },
        { immediate: true }
      )
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

      ipcRenderer.on('updater:update-available', (_, data) => {
        this.$store.dispatch('updater/setAvailableRelease', data)
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
      const $style = document.querySelector('style[name=plugins]')

      if (['light', 'dark'].includes(themeName)) {
        $style.innerHTML = null
      } else if (themeName && this.pluginThemes) {
        const theme = this.pluginThemes[themeName]
        if (theme) {
          const input = fs.readFileSync(theme.cssPath)
          const output = new CleanCss().minify(input)
          $style.innerHTML = output.styles
        } else {
          $style.innerHTML = null
        }
      }
    },

    applyPluginLanguage (languageName) {
      if (languageName === I18N.defaultLocale) {
        i18nSetup.setLanguage(languageName)
      } else if (languageName && this.pluginLanguages[languageName]) {
        i18nSetup.loadLanguage(languageName, this.pluginLanguages[languageName])
      }
    }
  }
}
</script>

<style scoped>
.App__main {
  transition: .1s filter linear;
}
.App__main.h-screen-adjusted {
  height: calc(100vh - 80px);
}
.App__container {
  max-width: 1400px;
}
@media (min-width: 768px) {
  .App__page {
    @apply .min-h-full;
    max-height: calc(100vh - 5rem);
  }
  .App__main.h-screen-adjusted {
    @apply h-screen;
  }
}
</style>
