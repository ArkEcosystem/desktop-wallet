<template>
  <div class="SliderImage">
    <div class="SliderImage__container">
      <div class="SliderImage__wrapper">
        <transition-group
          :name="sliderClass"
          tag="div"
          class="flex flex-no-wrap h-full"
          @after-leave="transitionEnd"
        >
          <div
            v-for="pageId in [currentIndex]"
            :key="pageId"
            class="SliderImage__slide"
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

      <Navigation
        v-if="pageCount > 1"
        @navigationclick="handleNavigation"
      />
    </div>

    <Pagination
      v-if="pageCount > 1"
      @paginationclick="goToPage"
    />
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
import Pagination from './Pagination.vue'

export default {
  name: 'SliderImage',

  components: {
    Navigation,
    Pagination
  },

  provide () {
    return {
      sliderImage: this
    }
  },

  props: {
    images: {
      type: Array,
      required: true,
      default: null
    }
  },

  data: () => ({
    perPage: 3,
    currentIndex: 0,
    isTransitioning: false,
    sliderClass: 'slides-right',
    selectedImage: null
  }),

  computed: {
    pageCount () {
      return Math.ceil(this.images.length / this.perPage)
    },

    getCurrentIndex () {
      return this.currentIndex
    }
  },

  methods: {
    getPageImages (pageIndex) {
      return this.images.slice(pageIndex * this.perPage, (pageIndex * this.perPage) + this.perPage)
    },

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
.SliderImage__container {
  @apply .relative .select-none;
  height: 150px;
}

.SliderImage__wrapper {
  @apply .w-full .h-full .relative .overflow-x-hidden;
}

.SliderImage__slide {
  @apply .absolute .flex .flex-none .h-full .pin .overflow-hidden;
}
.SliderImage__slide img {
  max-width: none;
}
.SliderImage__slide img:hover {
  @apply .cursor-pointer .opacity-75;
}

.slides-right-leave-active,
.slides-right-enter-active,
.slides-left-leave-active,
.slides-left-enter-active {
  transition: 0.5s;
}
.slides-left-leave-to,
.slides-right-enter {
  transform: translate(100%, 0);
}
.slides-left-enter,
.slides-right-leave-to {
  transform: translate(-100%, 0);
}
</style>
