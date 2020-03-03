<template>
  <div
    v-if="hasImages"
    class="PluginSlider"
  >
    <div class="relative w-full h-full">
      <!-- Images -->
      <transition-group
        :name="sliderClass"
        tag="div"
        class="flex flex-no-wrap h-full"
        @after-leave="transitionEnd"
      >
        <div
          v-for="imageId in [currentImage]"
          :key="imageId"
          class="PluginSlider__slide"
        >
          <img :src="`data:image/png;base64,${plugin.images[Math.abs(imageId) % plugin.images.length]}`">
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
</template>

<script>
import SvgIcon from '@/components/SvgIcon/SvgIcon'

export default {
  name: 'PluginSlider',

  components: {
    SvgIcon
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    currentImage: 0,
    isTransitioning: false,
    sliderClass: 'slides-right'
  }),

  computed: {
    hasImages () {
      return this.plugin.images && this.plugin.images.length > 0
    }
  },

  methods: {
    transitionEnd () {
      this.isTransitioning = false
    },

    previousImage () {
      if (this.isTransitioning) {
        return
      }

      this.isTransitioning = true
      this.sliderClass = 'slides-left'
      this.currentImage--
    },

    nextImage () {
      if (this.isTransitioning) {
        return
      }

      this.isTransitioning = true
      this.sliderClass = 'slides-right'
      this.currentImage++
    }
  }
}
</script>

<style scoped>
.PluginSlider {
  @apply .relative .overflow-x-hidden .select-none;
  height: 300px;
}

.PluginSlider__slide {
  @apply .absolute .flex .flex-none .h-full .pin .overflow-hidden;
  width: 640px;
}
.PluginSlider__slide img {
  @apply .max-w-full .m-auto;
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
  padding-left: 0.125rem;
}

.PluginSlider__left .SvgIcon,
.PluginSlider__right .SvgIcon {
  @apply .m-auto;
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
