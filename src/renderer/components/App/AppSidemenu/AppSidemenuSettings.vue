<template>
  <div v-click-outside.capture="emitClose">
    <MenuNavigationItem
      id="settings"
      :title="$t('APP_SIDEMENU.SETTINGS.TITLE')"
      :is-horizontal="isHorizontal"
      :can-activate="false"
      class="AppSidemenu__item"
      icon="settings"
      @click="toggleShowSettings"
    />

    <div
      v-if="isSettingsVisible"
      :class="isHorizontal ? 'AppSidemenuOptionsSettings--horizontal' : 'AppSidemenuOptionsSettings'"
      class="absolute z-20 theme-dark"
      @close="closeShowSettings"
    >
      <MenuOptions
        :is-horizontal="isHorizontal"
        :is-settings="true"
      >
        <MenuOptionsItem
          :title="$t('APP_SIDEMENU.SETTINGS.CURRENCY')"
          @click="toggleSelect('currency-menu')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <MenuDropdown
              ref="currency-menu"
              :items="currencies"
              :position="['-40%', '5%']"
              :value="sessionCurrency"
              @select="setCurrency"
            />
          </div>
        </MenuOptionsItem>

        <MenuOptionsItem
          :title="pluginThemes
            ? $t('APP_SIDEMENU.SETTINGS.THEME')
            : $t('APP_SIDEMENU.SETTINGS.DARK_MODE')
          "
          @click="toggleSelect(pluginThemes ? 'theme-menu' : 'dark-switch')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <MenuDropdown
              v-if="pluginThemes"
              ref="theme-menu"
              :items="themes"
              :position="['-40%', '5%']"
              :value="sessionTheme"
              @select="setTheme"
            />
            <ButtonSwitch
              v-else
              ref="dark-switch"
              :is-active="session_hasDarkTheme"
              class="theme-dark"
              background-color="var(--theme-settings-switch)"
              @change="setTheme"
            />
          </div>
        </MenuOptionsItem>

        <MenuOptionsItem
          v-if="!isLinux"
          :title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.TITLE')"
          @click="toggleDisableContentProtectionModal"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <ButtonSwitch
              ref="protection-switch"
              :is-active="contentProtection"
              class="theme-dark"
              background-color="var(--theme-settings-switch)"
            />
          </div>
        </MenuOptionsItem>

        <MenuOptionsItem
          :title="$t('APP_SIDEMENU.SETTINGS.BACKGROUND_UPDATE_LEDGER')"
          @click="toggleSelect('ledger-background-switch')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <ButtonSwitch
              ref="ledger-background-switch"
              :is-active="backgroundUpdateLedger"
              class="theme-dark"
              background-color="var(--theme-settings-switch)"
              @change="setBackgroundUpdateLedger"
            />
          </div>
        </MenuOptionsItem>

        <MenuOptionsItem
          :title="$t('APP_SIDEMENU.SETTINGS.BROADCAST_PEERS')"
          @click="toggleSelect('broadcast-peers')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <ButtonSwitch
              ref="broadcast-peers"
              :is-active="sessionBroadcastPeers"
              class="theme-dark"
              background-color="var(--theme-settings-switch)"
              @change="setBroadcastPeers"
            />
          </div>
        </MenuOptionsItem>

        <MenuOptionsItem
          :title="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.TITLE')"
          class="text-grey-light"
          @click="toggleResetDataModal"
        />

        <ModalConfirmation
          v-if="isToggleContentProtectionModalOpen"
          :title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.QUESTION')"
          :note="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.NOTE')"
          :cancel-button="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.SESSION_ONLY')"
          :continue-button="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.PERMANENTLY')"
          container-classes="max-w-md"
          @close="toggleDisableContentProtectionModal"
          @cancel="onToggleContentProtection"
          @continue="onToggleContentProtection(true)"
        />

        <ModalConfirmation
          v-if="isResetDataModalOpen"
          :title="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.QUESTION')"
          :note="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.NOTE')"
          container-classes="max-w-md"
          @close="toggleResetDataModal"
          @cancel="toggleResetDataModal"
          @continue="onResetData"
        />
      </MenuOptions>
    </div>
  </div>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { MenuNavigationItem, MenuOptions, MenuOptionsItem, MenuDropdown } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'
import { clone, isEmpty, isString } from 'lodash'
const os = require('os')

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    ModalConfirmation,
    MenuNavigationItem,
    MenuOptions,
    MenuOptionsItem,
    MenuDropdown,
    ButtonSwitch
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isResetDataModalOpen: false,
    isToggleContentProtectionModalOpen: false,
    isSettingsVisible: false,
    saveOnProfile: false
  }),

  computed: {
    isLinux () {
      // You can find the possible options here: https://nodejs.org/api/os.html#os_os_platform
      return os.platform() !== 'darwin' && os.platform() !== 'win32'
    },
    isMarketEnabled () {
      return this.session_network && this.session_network.market && this.session_network.market.enabled
    },
    currencies () {
      return this.$store.getters['market/currencies']
    },
    backgroundUpdateLedger () {
      return this.$store.getters['session/backgroundUpdateLedger']
    },
    sessionCurrency: {
      get () {
        return this.$store.getters['session/currency']
      },
      set (currency) {
        this.$store.dispatch('session/setCurrency', currency)
        const profile = clone(this.session_profile)
        profile.currency = currency
        this.$store.dispatch('profile/update', profile)
      }
    },
    sessionBroadcastPeers: {
      get () {
        return this.$store.getters['session/broadcastPeers']
      },
      set (broadcast) {
        this.$store.dispatch('session/setBroadcastPeers', broadcast)
        const profile = clone(this.session_profile)
        profile.broadcastPeers = broadcast
        this.$store.dispatch('profile/update', profile)
      }
    },
    sessionTheme: {
      get () {
        return this.$store.getters['session/theme']
      },
      set (theme) {
        this.$store.dispatch('session/setTheme', theme)
        const profile = clone(this.session_profile)
        profile.theme = theme
        this.$store.dispatch('profile/update', profile)
      }
    },
    contentProtection: {
      get () {
        return this.$store.getters['session/contentProtection']
      },
      set (protection) {
        this.$store.dispatch('session/setContentProtection', protection)
        if (!this.contentProtection || this.saveOnProfile) {
          const profile = clone(this.session_profile)
          profile.contentProtection = protection
          this.$store.dispatch('profile/update', profile)
        }
      }
    },
    sessionBackgroundUpdateLedger: {
      get () {
        return this.$store.getters['session/backgroundUpdateLedger']
      },
      set (update) {
        this.$store.dispatch('session/setBackgroundUpdateLedger', update)
        const profile = clone(this.session_profile)
        profile.backgroundUpdateLedger = update
        this.$store.dispatch('profile/update', profile)
      }
    },
    pluginThemes () {
      return isEmpty(this.$store.getters['plugin/themes'])
        ? null
        : this.$store.getters['plugin/themes']
    },
    themes () {
      return ['light', 'dark', ...Object.keys(this.pluginThemes)]
    }
  },

  methods: {
    toggleShowSettings () {
      this.isSettingsVisible = !this.isSettingsVisible
    },

    closeShowSettings () {
      this.isSettingsVisible = false
    },

    setCurrency (newCurrency) {
      this.sessionCurrency = newCurrency
    },

    setTheme (theme) {
      this.sessionTheme = isString(theme) ? theme : (theme ? 'dark' : 'light')
    },

    setBackgroundUpdateLedger (update) {
      this.sessionBackgroundUpdateLedger = update
    },

    setBroadcastPeers (broadcast) {
      this.sessionBroadcastPeers = broadcast
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    toggleDisableContentProtectionModal () {
      if (this.contentProtection || this.isToggleContentProtectionModalOpen) {
        this.isToggleContentProtectionModalOpen = !this.isToggleContentProtectionModalOpen
      } else {
        this.contentProtection = true
      }
    },

    toggleResetDataModal () {
      this.isResetDataModalOpen = !this.isResetDataModalOpen
    },

    async onResetData () {
      await this.$store.dispatch('resetData')
      this.electron_reload()
    },

    onToggleContentProtection (saveOnProfile = false) {
      this.saveOnProfile = saveOnProfile
      this.contentProtection = false
      this.toggleDisableContentProtectionModal()
    },

    emitClose () {
      if (this.outsideClick && !(this.isResetDataModalOpen || this.isToggleContentProtectionModalOpen)) {
        this.closeShowSettings()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuOptionsSettings {
  width: 360px;
  left: 6.5rem;
  bottom: -5rem;
  transform: translateY(-10%);
}

.AppSidemenuOptionsSettings .MenuOptions--vertical:after {
  top: 10.8rem;
}

.AppSidemenuOptionsSettings--horizontal {
  width: 300px;
  right: 8.5rem;
  top: 5.75rem;
}
</style>
