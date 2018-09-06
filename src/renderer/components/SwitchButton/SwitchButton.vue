<template>
  <button
    :class="{
      'SwitchButton--active': inputIsActive
    }"
    :style="{
      'background-color': backgroundColor
    }"
    :disabled="isDisabled"
    class="SwitchButton appearance-none rounded-full flex items-center relative cursor-pointer w-12 h-6 bg-theme-button"
    @click="toggle"
  >
    <span
      :class="{
        'bg-theme-option-button-text': !inputIsActive,
        'bg-blue': inputIsActive
      }"
      :style="{
        'border-color': backgroundColor
      }"
      class="SwitchButton__circle transition rounded-full w-6 h-full absolute border-2 border-theme-button"
    />
  </button>
</template>

<script>
export default {
  name: 'SwitchButton',

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
    inputIsActive: vm.isActive
  }),

  watch: {
    isActive (val) {
      this.inputIsActive = val
    }
  },

  methods: {
    toggle () {
      if (this.isDisabled) return

      this.inputIsActive = !this.inputIsActive
      this.$emit('change', this.inputIsActive)
    }
  }
}
</script>

<style scoped>
.SwitchButton__circle {
  transform: translateX(0%)
}

.SwitchButton--active .SwitchButton__circle {
  transform: translateX(100%)
}
</style>
