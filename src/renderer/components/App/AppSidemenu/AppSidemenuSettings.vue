<template>
  <MenuOptions
    v-click-outside="emitClose"
    :is-horizontal="isHorizontal"
    :class="isHorizontal ? 'AppSidemenuOptionsSettings--horizontal' : 'AppSidemenuOptionsSettings'"
    class="absolute z-20"
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
      :title="$t('APP_SIDEMENU.SETTINGS.DARK_MODE')"
      @click="toggleSelect('dark-switch')"
    >
      <div
        slot="controls"
        class="pointer-events-none"
      >
        <ButtonSwitch
          ref="dark-switch"
          :is-active="hasDarkTheme"
          class="theme-dark"
          background-color="#414767"
          @change="setTheme"
        />
      </div>
    </MenuOptionsItem>

    <MenuOptionsItem
      v-if="!isLinux"
      :title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION')"
      @click="toggleSelect('protection-switch')"
    >
      <div
        slot="controls"
        class="pointer-events-none"
      >
        <ButtonSwitch
          ref="protection-switch"
          :is-active="contentProtection"
          class="theme-dark"
          background-color="#414767"
          @change="setProtection"
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
      @cancel="toggleResetDataModal"
      @continue="onResetData"
    />
  </MenuOptions>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { MenuOptions, MenuOptionsItem, MenuDropdown } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'
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
    currencies () {
      return this.$store.getters['market/currencies']
    },
    hasDarkTheme () {
      return this.$store.getters['session/hasDarkTheme']
    },
    contentProtection () {
      return this.$store.getters['session/contentProtection']
    },
    sessionCurrency: {
      get () {
        return this.$store.getters['session/currency']
      },
      set (currency) {
        this.$store.dispatch('session/setCurrency', currency)
      }
    },
    sessionTheme: {
      get () {
        return this.$store.getters['session/theme']
      },
      set (theme) {
        this.$store.dispatch('session/setTheme', theme)
      }
    },
    sessionProtection: {
      get () {
        return this.$store.getters['session/contentProtection']
      },
      set (protection) {
        this.$store.dispatch('session/setContentProtection', protection)
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

    emitClose () {
      if (this.outsideClick) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.AppSidemenuOptionsSettings {
  width: 300px;
  left: 6.5rem;
  transform: translateY(-10%)
}

.AppSidemenuOptionsSettings--horizontal {
  width: 300px;
  right: 8.5rem;
  top: 5.5rem;
}
</style>
