<template>
  <button
    :class="{
      'px-3 py-2 antialiased': true,
      'rounded-l': isFirst,
      'rounded-r': isLast,
      'InputToggleChoice--selected bg-blue text-white font-semibold shadow-lg': isSelected,
      'bg-theme-input-toggle-choice text-theme-input-toggle-choice-text hover:bg-theme-input-toggle-choice-hover': !isSelected
    }"
    type="button"
    @click="emitSelect(choice)"
  >
    {{ choice }}
  </button>
</template>

<script>
export default {
  name: 'InputToggleChoice',

  props: {
    choice: {
      type: String,
      required: true
    },
    selectedChoice: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    }
  },
  computed: {
    isSelected () {
      return this.choice === this.selectedChoice
    },

    isFirst () {
      return this.index === 0
    },

    isLast () {
      return this.index === this.length - 1
    }
  },

  methods: {
    emitSelect (choice) {
      this.$emit('select', choice)
    }
  }
}
</script>
