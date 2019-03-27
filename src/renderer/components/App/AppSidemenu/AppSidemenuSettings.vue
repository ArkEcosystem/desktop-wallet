<template>
  <div
    v-click-outside="emitClose"
    :class="
      isHorizontal
        ? 'AppSidemenuOptionsSettings--horizontal'
        : 'AppSidemenuOptionsSettings'
    "
    class="absolute z-20 theme-dark"
  >
    <MenuOptions :is-horizontal="isHorizontal" :is-settings="true">
      <MenuOptionsItem
        :title="$t('APP_SIDEMENU.SETTINGS.CURRENCY')"
        @click="toggleSelect('currency-menu')"
      >
        <div slot="controls" class="pointer-events-none">
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
        :title="$t('APP_SIDEMENU.SETTINGS.DARK_MODE')"
        @click="toggleSelect('dark-switch')"
      >
        <div slot="controls" class="pointer-events-none">
          <ButtonSwitch
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
        :title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION')"
        @click="toggleSelect('protection-switch')"
      >
        <div slot="controls" class="pointer-events-none">
          <ButtonSwitch
            ref="protection-switch"
            :is-active="contentProtection"
            class="theme-dark"
            background-color="var(--theme-settings-switch)"
            @change="setProtection"
          />
        </div>
      </MenuOptionsItem>

      <MenuOptionsItem
        :title="$t('APP_SIDEMENU.SETTINGS.BACKGROUND_UPDATE_LEDGER')"
        @click="toggleSelect('ledger-background-switch')"
      >
        <div slot="controls" class="pointer-events-none">
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
        <div slot="controls" class="pointer-events-none">
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
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { MenuOptions, MenuOptionsItem, MenuDropdown } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'
import { clone } from 'lodash'
const os = require('os')

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    ModalConfirmation,
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
    isResetDataModalOpen: false
  }),

  computed: {
    isLinux () {
      // You can find the possible options here: https://nodejs.org/api/os.html#os_os_platform
      return os.platform() !== 'darwin' && os.platform() !== 'win32'
    },
    isMarketEnabled () {
      return (
        this.session_network &&
        this.session_network.market &&
        this.session_network.market.enabled
      )
    },
    currencies () {
      return this.$store.getters['market/currencies']
    },
    contentProtection () {
      return this.$store.getters['session/contentProtection']
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
    sessionProtection: {
      get () {
        return this.$store.getters['session/contentProtection']
      },
      set (protection) {
        this.$store.dispatch('session/setContentProtection', protection)
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
    }
  },

  methods: {
    setCurrency (newCurrency) {
      this.sessionCurrency = newCurrency
    },

    setTheme (newTheme) {
      this.sessionTheme = newTheme ? 'dark' : 'light'
    },

    setProtection (protection) {
      this.sessionProtection = protection
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

    toggleResetDataModal () {
      this.isResetDataModalOpen = !this.isResetDataModalOpen
    },

    async onResetData () {
      await this.$store.dispatch('resetData')
      this.electron_reload()
    },

    goToNetworkOverview () {
      this.$emit('close')
      this.$router.push({ name: 'networks' })
    },

    emitClose () {
      if (this.outsideClick) {
        this.$emit('close')
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
  top: 7.8rem;
}

.AppSidemenuOptionsSettings--horizontal {
  width: 300px;
  right: 8.5rem;
  top: 5.75rem;
}
</style>
