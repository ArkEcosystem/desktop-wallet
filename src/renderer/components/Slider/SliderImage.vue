<template>
  <div
    v-if="hasImages"
    class="SliderImage"
    :class="{
      'flex flex-col': !isRow
    }"
  >
    <div
      class="SliderImage__container"
      :class="{
        'SliderImage__container--row': isRow,
        'SliderImage__container--stack': !isRow
      }"
    >
      <div
        class="SliderImage__container__content"
        :class="{
          'overflow-x-hidden': isRow
        }"
      >
        <transition-group
          :name="sliderClass"
          tag="div"
          class="flex flex-no-wrap h-full"
          @after-leave="transitionEnd"
        >
          <div
            v-for="index in [currentIndex]"
            :key="index"
            class="SliderImage__slide"
            :class="{
              'SliderImage__slide--stack w-full justify-center': !isRow
            }"
          >
            <div
              v-if="isRow"
              class="SliderImage__slide SliderImage__slide--row"
            >
              <div
                v-for="(image, imageId) in getPageImages(index)"
                :key="imageId"
                class="flex w-1/3 justify-center overflow-hidden mx-1 rounded-xl border-2 border-theme-line-separator hover:border-grey"
              >
                <img
                  :src="`data:image/png;base64,${image}`"
                  class="m-auto h-full"
                  @click="openImage(imageId)"
                >
              </div>
            </div>

            <img
              v-else
              :src="`data:image/png;base64,${images[index]}`"
            >
          </div>
        </transition-group>
      </div>

      <Navigation
        v-if="showNavigation && pageCount > 1"
        :left-button-class="isRow ? '-ml-2' : 'ml-6'"
        :right-button-class="isRow ? '-mr-2' : 'mr-6'"
        @navigationclick="handleNavigation"
      />
    </div>

    <Pagination
      v-if="showPagination && pageCount > 1"
      :current-index="currentIndex"
      :page-count="pageCount"
      @paginationclick="goToPage"
    />

    <slot
      :image-index="selectedImage"
      :close-image="closeImage"
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

  props: {
    isRow: {
      type: Boolean,
      required: false,
      default: false
    },

    images: {
      type: Array,
      required: true,
      default: null
    },

    imageIndex: {
      type: Number,
      required: false,
      default: 0
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

  data: (vm) => ({
    currentIndex: vm.imageIndex,
    isTransitioning: false,
    sliderClass: 'slides-right',
    selectedImage: null
  }),

  computed: {
    hasImages () {
      return this.images && this.images.length > 0
    },

    pageCount () {
      return this.isRow ? Math.ceil(this.images.length / this.perPage) : this.images.length
    }
  },

  mounted () {
    if (!this.isRow) {
      document.addEventListener('keyup', this.onArrowKeys, false)
    }
  },

  destroyed () {
    if (!this.isRow) {
      document.removeEventListener('keyup', this.onArrowKeys)
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

      const imageCount = this.isRow ? this.pageCount - 1 : this.images.length - 1

      this.isTransitioning = true

      if (direction === 'backward') {
        if (this.currentIndex === 0) {
          this.sliderClass = 'slides-right'
          this.currentIndex = imageCount
        } else {
          this.sliderClass = 'slides-left'
          this.currentIndex--
        }
      } else if (direction === 'forward') {
        if (this.currentIndex >= imageCount) {
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
    },

    onArrowKeys (event) {
      if (event.key === 'ArrowLeft') {
        this.transitionEnd()
        this.handleNavigation('backward')
      } else if (event.key === 'ArrowRight') {
        this.transitionEnd()
        this.handleNavigation('forward')
      }
    },

    openImage (imageId) {
      this.selectedImage = this.currentIndex * this.perPage + imageId
    },

    closeImage () {
      this.selectedImage = null
    }
  }
}
</script>

<style scoped>
.SliderImage__container {
  @apply .relative .select-none;
}
.SliderImage__container--row {
  height: 150px;
}
.SliderImage__container--stack {
  @apply .flex-1 .overflow-x-hidden;
  width: 640px;
  height: 550px;
}

.SliderImage__container__content {
  @apply .w-full .h-full .relative;
}

.SliderImage__slide {
  @apply .absolute .flex .flex-none .h-full .pin .overflow-hidden;
}

.SliderImage__slide--row img {
  max-width: none;
}
.SliderImage__slide--row img:hover {
  @apply .cursor-pointer .opacity-75;
}

.SliderImage__slide--stack img {
  max-width: none;
  height: max-content;
  @apply .m-auto .max-h-full;
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
