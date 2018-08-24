<template>
  <OptionsMenu
    class="AppSidemenuOptionsSettings absolute">
    <OptionsMenuItem
      title="Currency"
      @click="toggleSelect('currency-menu')">
      <div
        slot="controls"
        class="pointer-events-none">
        <SelectMenu
          ref="currency-menu"
          :items="['ETH', 'EUR', 'USD']"
          :position="['-40%', '5%']"
          value="USD" />
      </div>
    </OptionsMenuItem>

    <OptionsMenuItem title="Language">
      // TODO: waiting for the switch component to implement dark mode
      <div
        slot="controls"
        class="flex itens-center">
        <span class="font-semibold mr-1">English</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          class="fill-current w-4 h-4">
          <g>
            <polygon points="128,192 256,320 384,192" />
          </g>
        </svg>
      </div>
    </OptionsMenuItem>
  </OptionsMenu>
</template>

<script>
import { OptionsMenu, OptionsMenuItem } from '@/components/OptionsMenu'
import SelectMenu from '@/components/SelectMenu'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    OptionsMenu,
    OptionsMenuItem,
    SelectMenu
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
  left: 5.5rem
}
</style>
