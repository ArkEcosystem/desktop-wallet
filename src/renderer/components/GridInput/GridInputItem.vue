<template>
  <div
    :style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
    :title="title"
    :class="isSelected ? 'border-green' : 'border-transparent'"
    class="GridInputItem background-image rounded-lg w-24 h-24 border-2 cursor-pointer rounded-lg hover:shadow transition"
  >
    {{ textContent }}
  </div>
</template>

<script>
/**
 * This component has the default style
 */
export default {
  name: 'GridInputItem',

  props: {
    imagePath: {
      type: [String, Boolean],
      default: null
    },
    textContent: {
      type: String,
      default: null
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
/* To display the images scaled to the size of the button */
.GridInputItem {
  background-size: cover;
  background-position: center center;
}
</style>
