<template>
  <!-- FIXME close when click outside, or after a while outside the area -->
  <MenuOptions
    class="AppSidemenuOptionsSettings absolute z-10"
  >
    <MenuOptionsItem
      title="Currency"
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
      title="Dark mode"
      @click="toggleSelect('dark-switch')">
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
  </MenuOptions>
</template>

<script>
import { MenuOptions, MenuOptionsItem, MenuDropdown } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    MenuOptions,
    MenuOptionsItem,
    MenuDropdown,
    ButtonSwitch
  },

  computed: {
    currencies () {
      return this.$store.getters['market/currencies']
    },
    hasDarkTheme () {
      return this.$store.getters['session/hasDarkTheme']
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
    }
  },

  methods: {
    setCurrency (newCurrency) {
      this.sessionCurrency = newCurrency
    },
    setTheme (newTheme) {
      this.sessionTheme = newTheme ? 'dark' : 'light'
    },
    toggleSelect (name) {
      this.$refs[name].toggle()
    }
  }
}
</script>

<style scoped>
.AppSidemenuOptionsSettings {
  width: 300px;
  left: 5.5rem;
}
</style>
