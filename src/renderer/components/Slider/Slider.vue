<template>
  <div
    v-if="hasImages"
    class="Slider"
  >
    <SliderImage
      :images="data"
    />
  </div>
</template>

<script>
import SliderImage from './SliderImage'

export default {
  name: 'Slider',

  components: {
    SliderImage
  },

  provide () {
    return {
      slider: this
    }
  },

  props: {
    data: {
      type: Array,
      required: true,
      default: null
    }
  },

  computed: {
    hasImages () {
      return this.data && this.data.length > 0
    }
  }
}
</script>

<style scoped>
</style>
