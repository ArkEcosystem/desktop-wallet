<template>
  <button
    :class="{
      'InputSwitch--active': inputisActive
    }"
    :style="{
      'background-color': backgroundColor
    }"
    :disabled="isDisabled"
    class="InputSwitch appearance-none rounded-full flex items-center relative cursor-pointer w-12 h-6 bg-theme-button"
    @click="toggle"
  >
    <span
      :class="{
        'bg-theme-option-button-text': !inputisActive,
        'bg-blue': inputisActive
      }"
      :style="{
        'border-color': backgroundColor
      }"
      class="InputSwitch__circle transition rounded-full w-6 h-full absolute border-2 border-theme-button"
    />
  </button>
</template>

<script>
export default {
  name: 'InputSwitch',

  model: {
    prop: 'isActive',
    event: 'change'
  },

  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    backgroundColor: {
      type: String,
      required: false,
      default: null
    }
  },

  data: vm => ({
    inputisActive: vm.isActive
  }),

  watch: {
    isActive (val) {
      this.inputisActive = val
    }
  },

  methods: {
    toggle () {
      if (this.isDisabled) return

      this.inputisActive = !this.inputisActive
      this.$emit('change', this.inputisActive)
    }
  }
}
</script>

<style scoped>
.InputSwitch__circle {
  transform: translateX(0%)
}

.InputSwitch--active .InputSwitch__circle {
  transform: translateX(100%)
}
</style>
