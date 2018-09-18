<template>
  <div
    :class="walletNavigationTabClasses"
    @click="$emit('changeTab', tab.component)"
  >
    {{ tab.text }}
  </div>
</template>
<script>
export default {
  props: {
    currentTab: {
      type: String,
      required: true
    },
    tab: {
      type: Object,
      required: true
    }
  },
  computed: {
    walletNavigationTabClasses () {
      const isSelected = this.tab.component === this.currentTab

      return {
        [this.tab.component]: true,
        'px-4 py-6 cursor-pointer select-none font-bold': true,
        'WalletNavigation--selected bg-white': isSelected,
        'WalletNavigation--unselected antialiased': !isSelected
      }
    }
  }
}
</script>

<style scoped>
  .WalletNavigation--selected {
    color: #000033;
  }
  .WalletNavigation--unselected {
    color: #8597A8
  }
</style>
