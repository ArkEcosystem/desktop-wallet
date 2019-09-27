<template>
  <button
    class="ButtonGeneric"
    :class="isSmall ? 'blue-small-button' : 'blue-button'"
    @click="emitClick"
  >
    <span class="font-semibold whitespace-no-wrap">
      {{ label }}
    </span>
  </button>
</template>

<script>

export default {
  name: 'ButtonGeneric',

  props: {
    label: {
      type: String,
      required: true
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
