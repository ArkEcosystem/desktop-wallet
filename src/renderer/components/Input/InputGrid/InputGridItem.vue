<template>
  <div
    :style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
    :title="title"
    :class="isSelected ? 'InputGridItem--selected' : null"
    class="InputGridItem background-image rounded-lg w-18 h-18 border-4 cursor-pointer rounded-xl hover:shadow transition text-center border-theme-feature"
  >
    {{ textContent }}
  </div>
</template>

<script>
/**
 * This component has the default style
 */
export default {
  name: 'InputGridItem',

  props: {
    imagePath: {
      // TODO without boolean?
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
.InputGridItem {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.InputGridItem--selected {
  box-shadow: 0 0 0 2px config('colors.green');
}
</style>
