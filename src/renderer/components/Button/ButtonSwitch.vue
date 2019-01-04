<template>
  <button
    :class="{
      'ButtonSwitch--active': inputIsActive
    }"
    :style="{
      'background-color': backgroundColor
    }"
    :disabled="isDisabled"
    class="ButtonSwitch appearance-none rounded-full flex items-center relative cursor-pointer w-12 h-6 bg-theme-switch-button"
    type="button"
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
      class="ButtonSwitch__circle transition rounded-full w-6 h-full absolute border-2 border-theme-button"
    />
  </button>
</template>

<script>
export default {
  name: 'ButtonSwitch',

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

  computed: {
    model: {
      get () {
        return this.inputIsActive
      },
      set (value) {
        this.inputIsActive = value
        this.$emit('change', value)
      }
    }
  },

  watch: {
    isActive (isActive) {
      this.inputIsActive = isActive
    }
  },

  methods: {
    toggle () {
      if (this.isDisabled) {
        return
      }

      this.model = !this.model
    }
  }
}
</script>

<style scoped>
.ButtonSwitch__circle {
  transform: translateX(0%)
}

.ButtonSwitch--active .ButtonSwitch__circle {
  transform: translateX(100%)
}
</style>
