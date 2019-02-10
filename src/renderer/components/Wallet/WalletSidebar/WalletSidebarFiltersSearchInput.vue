<template>
  <div
    class="WalletSidebarFiltersSearchInput flex flex-row"
  >
    <div
      class="cursor-pointer mr-4 text-theme-settings-text"
      @click="focus"
    >
      <SvgIcon
        name="search"
        view-box="0 0 17 16"
      />
    </div>

    <input
      ref="input"
      :placeholder="placeholder"
      :value="inputValue"
      class="WalletSidebarFiltersSearchInput____input flex flex-grow bg-transparent text-theme-settings-text font-semibold"
      name="wallet-sidebar-filters-search"
      type="text"
      @input="updateInput"
    >
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletSidebarFiltersInputSearch',

  components: {
    SvgIcon
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
      inputValue: this.value
    }
  },

  watch: {
    value (value) {
      this.inputValue = value
    }
  },

  methods: {
    emitInput () {
      this.$emit('input', this.inputValue)
    },

    updateInput (event) {
      this.inputValue = event.target.value
      this.emitInput()
    },

    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
