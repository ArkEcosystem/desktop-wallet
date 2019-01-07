<template>
  <button
    type="button"
    class="ButtonLetter"
  >
    {{ letter }}
  </button>
</template>

<script>
export default {
  name: 'ButtonLetter',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  computed: {
    letter () {
      return this.value.charAt(0)
    }
  }
}
</script>

<style lang="postcss" scoped>
.ButtonLetter {
  @apply rounded-full flex items-center justify-center uppercase font-semibold w-5 h-5
}
</style>
