<template>
  <div v-if="hasImages">
    <div class="PluginSlider">
      <div class="overflow-x-hidden relative w-full h-full">
        <!-- Images -->
        <transition-group
          :name="sliderClass"
          tag="div"
          class="flex flex-no-wrap h-full"
          @after-leave="transitionEnd"
        >
          <div
            v-for="pageId in [currentIndex]"
            :key="pageId"
            class="PluginSlider__slide"
          >
            <div
              v-for="(image, imageId) in getPageImages(pageId)"
              :key="imageId"
              class="flex w-1/3 justify-center overflow-hidden mx-1 rounded-xl"
            >
              <img
                :src="`data:image/png;base64,${image}`"
                class="m-auto h-full arounded-xl"
                @click="openImage(imageId)"
              >
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Left Button -->
      <div
        v-if="pageCount > 1"
        class="PluginSlider__left"
        @click="previousImage"
      >
        <SvgIcon
          name="caret-left"
          view-box="0 0 12 12"
        />
      </div>

      <!-- Right Button -->
      <div
        v-if="pageCount > 1"
        class="PluginSlider__right"
        @click="nextImage"
      >
        <SvgIcon
          name="caret-right"
          view-box="0 0 12 12"
        />
      </div>
    </div>

    <div
      v-if="pageCount > 1"
      class="flex mt-4 justify-center"
    >
      <div
        v-for="page in pageCount"
        :key="page"
        class="PluginSlider__page"
        :class="{
          'bg-theme-button': currentIndex + 1 !== page,
          'bg-theme-button-active': currentIndex + 1 === page
        }"
        @click="goToPage(page)"
      />
    </div>

    <PluginImageModal
      v-if="selectedImage !== null"
      :image-index="selectedImage"
      :images="images"
      @close="selectedImage = null"
    />
  </div>
</template>

<script>
import PluginImageModal from '@/components/PluginManager/PluginManagerModals/PluginImageModal'
import SvgIcon from '@/components/SvgIcon/SvgIcon'

export default {
  name: 'PluginSlider',

  components: {
    PluginImageModal,
    SvgIcon
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  data: (vm) => ({
    perPage: 3,
    currentIndex: 0,
    isTransitioning: false,
    sliderClass: 'slides-right',
    images: vm.plugin.images,
    selectedImage: null
  }),

  computed: {
    hasImages () {
      return this.images && this.images.length > 0
    },

    pageCount () {
      return Math.ceil(this.images.length / this.perPage)
    }
  },

  methods: {
    getPageImages (pageIndex) {
      return this.images.slice(pageIndex * this.perPage, (pageIndex * this.perPage) + this.perPage)
    },

    transitionEnd () {
      this.isTransitioning = false
    },

    previousImage () {
      if (this.isTransitioning) {
        return
      }

      this.isTransitioning = true
      if (this.currentIndex === 0) {
        this.sliderClass = 'slides-right'
        this.currentIndex = this.pageCount - 1
      } else {
        this.sliderClass = 'slides-left'
        this.currentIndex--
      }
    },

    nextImage () {
      if (this.isTransitioning) {
        return
      }

      this.isTransitioning = true
      if (this.currentIndex >= this.pageCount - 1) {
        this.sliderClass = 'slides-left'
        this.currentIndex = 0
      } else {
        this.sliderClass = 'slides-right'
        this.currentIndex++
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

    openImage (imageId) {
      this.selectedImage = this.currentIndex * this.perPage + imageId
    }
  }
}
</script>

<style scoped>
.PluginSlider {
  @apply .relative .select-none;
  height: 150px;
}

.PluginSlider__slide {
  @apply .absolute .flex .flex-none .h-full .pin .overflow-hidden;
}
.PluginSlider__slide img {
  max-width: none;
}
.PluginSlider__slide img:hover {
  @apply .cursor-pointer .opacity-75;
}

.PluginSlider__left,
.PluginSlider__right {
  @apply .absolute .rounded .bg-theme-button .text-theme-button-text .flex .pin-y .my-auto .cursor-pointer .shadow;
  width: 35px;
  height: 35px;
}

.PluginSlider__left:hover,
.PluginSlider__right:hover {
  @apply .bg-theme-button-active;
}

.PluginSlider__left {
  @apply .pin-l .-ml-2;
  padding-right: 0.125rem;
}

.PluginSlider__right {
  @apply .pin-r .-mr-2;
}

.PluginSlider__left .SvgIcon,
.PluginSlider__right .SvgIcon {
  @apply .m-auto;
}

.PluginSlider__page {
  @apply .rounded-full .p-1 .mx-1 .cursor-pointer;
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
