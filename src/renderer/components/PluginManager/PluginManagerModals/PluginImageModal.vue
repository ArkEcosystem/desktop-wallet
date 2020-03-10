<template>
  <ModalWindow
    modal-classes="PluginImageModal"
    aacontainer-classes="PluginImageModal max-w-md"
    @close="emitClose"
  >
    <div class="flex flex-col">
      <div class="PluginSlider">
        <div class="relative w-full h-full">
          <!-- Images -->
          <transition-group
            :name="sliderClass"
            tag="div"
            class="flex flex-no-wrap h-full"
            @after-leave="transitionEnd"
          >
            <div
              v-for="imageId in [currentIndex]"
              :key="imageId"
              class="PluginSlider__slide"
            >
              <img :src="`data:image/png;base64,${images[imageId]}`">
            </div>
          </transition-group>
        </div>

        <!-- Left Button -->
        <div
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
          class="PluginSlider__right"
          @click="nextImage"
        >
          <SvgIcon
            name="caret-right"
            view-box="0 0 12 12"
          />
        </div>
      </div>

      <div class="flex flex-inline mt-4 justify-center">
        <div
          v-for="page in images.length"
          :key="page"
          class="PluginSlider__page"
          :class="{
            'bg-theme-button': currentIndex + 1 !== page,
            'bg-theme-button-active': currentIndex + 1 === page
          }"
          @click="goToPage(page)"
        />
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon/SvgIcon'

export default {
  name: 'PluginImageModal',

  components: {
    ModalWindow,
    SvgIcon
  },

  props: {
    images: {
      type: Array,
      required: true
    },

    imageIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data: (vm) => ({
    currentIndex: vm.imageIndex,
    isTransitioning: false,
    sliderClass: 'slides-right'
  }),

  methods: {
    emitClose () {
      this.$emit('close')
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
        this.currentIndex = this.images.length - 1
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
      if (this.currentIndex >= this.images.length - 1) {
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
    }
  }
}
</script>

<style>
.PluginImageModal .ModalWindow__container__content {
  @apply .p-4;
}
.PluginImageModal article {
  @apply .flex .mt-0;
}
</style>

<style scoped>
.PluginSlider {
  @apply .flex-1 .relative .overflow-x-hidden .select-none;
  width: 640px;
  height: 550px;
}

.PluginSlider__slide {
  @apply .absolute .flex .flex-none .h-full .w-full .pin .overflow-hidden .justify-center;
}

.PluginSlider__slide img {
  max-width: none;
  height: max-content;
  @apply .m-auto .max-h-full;
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
  @apply .pin-l .ml-6;
  padding-right: 0.125rem;
}

.PluginSlider__right {
  @apply .pin-r .mr-6;
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
