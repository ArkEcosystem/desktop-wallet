<template>
  <div class="wallet-navigation flex">
    <WalletNavigationTab
      v-for="tab in tabs"
      :key="tab.text"
      :tab="tab"
      :current-tab="currentTab"
      @changeTab="onChangeTab"
    />
  </div>
</template>

<script>
import WalletNavigationTab from './WalletNavigationTab.vue'

export default {
  name: 'WalletNavigation',
  components: {
    WalletNavigationTab
  },
  model: {
    prop: 'currentTab',
    event: 'changeTab'
  },
  props: {
    currentTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    }
  },
  methods: {
    onChangeTab (tab) {
      this.$emit('changeTab', tab)
    }
  }
}
</script>

<style scoped>
  .wallet-navigation {
    background-color: #F7F9FB;
  }
</style>
