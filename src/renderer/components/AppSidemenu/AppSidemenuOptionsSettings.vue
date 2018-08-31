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
          :value="defaultCurrency"
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
        <InputSwitch
          ref="dark-switch"
          class="theme-dark"
          background-color="#414767"
        />
      </div>
    </MenuOptionsItem>
  </MenuOptions>
</template>

<script>
import { MARKET } from '@config'
import { MenuOptions, MenuOptionsItem } from '@/components/MenuOptions'
import MenuDropdown from '@/components/MenuDropdown'
import { InputSwitch } from '@/components/InputSwitch'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    MenuOptions,
    MenuOptionsItem,
    MenuDropdown,
    InputSwitch
  },

  computed: {
    defaultCurrency () {
      return this.currencies[0]
    },
    currencies () {
      return MARKET.currencies
    }
  },

  methods: {
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
