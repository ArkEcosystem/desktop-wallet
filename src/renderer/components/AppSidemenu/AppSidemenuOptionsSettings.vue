<template>
  <!-- FIXME close when click outside, or after a while outside the area -->
  <OptionsMenu
    class="AppSidemenuOptionsSettings absolute z-10"
  >
    <OptionsMenuItem
      title="Currency"
      @click="toggleSelect('currency-menu')"
    >
      <div
        slot="controls"
        class="pointer-events-none"
      >
        <SelectMenu
          ref="currency-menu"
          :items="currencies"
          :position="['-40%', '5%']"
          :value="defaultCurrency"
        />
      </div>
    </OptionsMenuItem>

    <OptionsMenuItem
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
    </OptionsMenuItem>
  </OptionsMenu>
</template>

<script>
import { MARKET } from '@config'
import { OptionsMenu, OptionsMenuItem } from '@/components/OptionsMenu'
import SelectMenu from '@/components/SelectMenu'
import { InputSwitch } from '@/components/InputSwitch'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    OptionsMenu,
    OptionsMenuItem,
    SelectMenu,
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
