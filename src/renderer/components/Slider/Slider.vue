<template>
  <div
    v-if="hasImages"
    class="Slider"
  >
    <div class="Slider-wrapper">
      <SliderImage
        v-if="type === 'image'"
        :images="data"
        :slider-class="sliderClass"
      />

      <Navigation
        v-if="showNavigation && pageCount > 1"
        @navigationclick="handleNavigation"
      />
    </div>

    <Pagination
      v-if="showPagination && pageCount > 1"
      @paginationclick="goToPage"
    />
  </div>
</template>

<script>
import SliderImage from './SliderImage'
import Navigation from './Navigation.vue'
import Pagination from './Pagination.vue'

export default {
  name: 'Slider',

  components: {
    SliderImage,
    Navigation,
    Pagination
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
    },

    type: {
      type: String,
      required: false,
      default: 'image' // or 'text'
    },

    perPage: {
      type: Number,
      required: false,
      default: 3
    },

    showNavigation: {
      type: Boolean,
      required: false,
      default: true
    },

    showPagination: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    currentIndex: 0,
    isTransitioning: false,
    sliderClass: 'slides-right',
    selectedImage: null
  }),

  computed: {
    hasImages () {
      return this.data && this.data.length > 0
    },

    pageCount () {
      return Math.ceil(this.data.length / this.perPage)
    },

    getCurrentIndex () {
      return this.currentIndex
    }
  },

  methods: {
    transitionEnd () {
      this.isTransitioning = false
    },

    handleNavigation (direction) {
      if (this.isTransitioning) {
        return
      }

      this.isTransitioning = true

      if (direction === 'backward') {
        if (this.currentIndex === 0) {
          this.sliderClass = 'slides-right'
          this.currentIndex = this.pageCount - 1
        } else {
          this.sliderClass = 'slides-left'
          this.currentIndex--
        }
      } else if (direction === 'forward') {
        if (this.currentIndex >= this.pageCount - 1) {
          this.sliderClass = 'slides-left'
          this.currentIndex = 0
        } else {
          this.sliderClass = 'slides-right'
          this.currentIndex++
        }
      } else {

      }
    },

    goToPage (page) {
      if (page < this.currentIndex + 1) {
        this.sliderClass = 'slides-left'
      } else if (page > this.currentIndex + 1) {
        this.sliderClass = 'slides-right'
      } else {
        return
      }

      this.isTransitioning = true
      this.currentIndex = page - 1
    }
  }
}
</script>

<style scoped>
.Slider-wrapper {
  @apply .relative .select-none;
  height: 150px;
}
</style>
