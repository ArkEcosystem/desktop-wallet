<template>
  <div
    class="flex flex-row"
  >
    <input
      ref="input"
      v-model="value"
      name="wallet-sidebar-filters-search"
      :placeholder="placeholder"
      type="text"
      class="WalletSidebarFiltersSearchInput____input flex flex-grow bg-transparent text-theme-page-text"
    >

    <SvgIcon
      name="search"
      view-box="0 0 17 16"
      class="mr-4"
    />
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletSidebarFiltersInputSearch',

  components: {
    SvgIcon
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    }
  },

  data () {
    return {
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletSidebarFiltersSearchInput {
}
</style>
