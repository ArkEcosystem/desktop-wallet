<template>
  <button
    :class="{
      'px-3 py-2 antialiased': true,
      'rounded-l': isFirst,
      'rounded-r': isLast,
      'bg-blue text-white font-semibold shadow-lg': isSelected,
      'bg-grey-lighter text-grey-darker': !isSelected
    }"
    @click="$emit('choice-select', choice)"
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
  }
}
</script>
