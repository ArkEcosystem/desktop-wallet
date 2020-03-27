<template>
  <div class="Slider-image">
    <transition-group
      :name="sliderClass"
      tag="div"
      class="flex flex-no-wrap h-full"
      @after-leave="transitionEnd"
    >
      <div
        v-for="pageId in [currentIndex]"
        :key="pageId"
        class="Slider-image__slide"
      >
        <div
          v-for="(image, imageId) in getPageImages(pageId)"
          :key="imageId"
          class="flex w-1/3 justify-center overflow-hidden mx-1 rounded-xl"
        >
          <img
            :src="`data:image/png;base64,${image}`"
            class="m-auto h-full arounded-xl"
          >
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SliderImage',

  inject: ['slider'],

  props: {
    images: {
      type: Array,
      required: true,
      default: null
    },

    sliderClass: {
      type: String,
      required: false,
      default: 'slides-right' // or 'slides-left'
    }
  },

  computed: {
    transitionEnd () {
      return this.slider.transitionEnd()
    },

    currentIndex () {
      return this.slider.getCurrentIndex
    },

    getPageImages (pageIndex) {
      const { perPage } = this.slider
      return this.images.slice(pageIndex * perPage, (pageIndex * perPage) + perPage)
    }
  }
}
</script>

<style scoped>
.Slider-image {
  @apply .w-full .h-full .relative .overflow-x-hidden;
}

.Slider-image__slide {
  @apply .absolute .flex .flex-none .h-full .pin .overflow-hidden;
}
.Slider-image__slide img {
  max-width: none;
}
.Slider-image__slide img:hover {
  @apply .cursor-pointer .opacity-75;
}
</style>
