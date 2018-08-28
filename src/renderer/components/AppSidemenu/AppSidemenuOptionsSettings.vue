<template>
  <!-- FIXME close when click outside, or after a while outside the area -->
  <OptionsMenu
    class="AppSidemenuOptionsSettings z-10 absolute"
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

    <OptionsMenuItem title="Dark mode">
      <!-- TODO: waiting for the switch component to implement dark mode -->
      <div
        slot="controls"
        class="flex itens-center"
      >
        SWITCH HERE
      </div>
    </OptionsMenuItem>
  </OptionsMenu>
</template>

<script>
import { MARKET } from '@config'
import { OptionsMenu, OptionsMenuItem } from '@/components/OptionsMenu'
import SelectMenu from '@/components/SelectMenu'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    OptionsMenu,
    OptionsMenuItem,
    SelectMenu
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
