<template>
  <button class="ButtonGeneric blue-button" @click="emitClick">
    <span class="font-semibold">
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
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
