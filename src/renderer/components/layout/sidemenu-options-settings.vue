<template>
  <options-menu
    class="settings-options-menu absolute">
    <options-menu-item
      title="Currency"
      @click="toggleSelect('currency-menu')">
      <div
        slot="controls"
        class="pointer-events-none">
        <select-menu
          ref="currency-menu"
          :items="['ETH', 'EUR', 'USD']"
          :position="['-40%', '5%']"
          value="USD" />
      </div>
    </options-menu-item>

    <options-menu-item title="Language">
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
    </options-menu-item>
  </options-menu>
</template>

<script>
import OptionsMenu from '@/components/options-menu/options-menu'
import OptionsMenuItem from '@/components/options-menu/options-menu-item'
import SelectMenu from '@/components/select-menu/select-menu'

export default {
  name: 'SidemenuOptionsSettings',

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
.settings-options-menu {
  width: 300px;
  left: 5.5rem
}
</style>
