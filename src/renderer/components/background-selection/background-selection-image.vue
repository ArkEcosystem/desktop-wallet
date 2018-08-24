<template>
  <li
    :style="{ backgroundImage: `url('${ assets_loadImage(url) }')` }"
    :class="isActive ? 'border-green' : 'border-transparent'"
    class="background-selection-image transition border-2 cursor-pointer background-image rounded-lg w-24 h-24 m-2 hover:shadow"
    @click="$emit('click', url)" />
</template>

<script>
export default {
  name: 'BackgroundSelectionImage',

  props: {
    url: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>
.background-selection-image {
  background-size: cover;
  background-position: center center;
}
</style>
