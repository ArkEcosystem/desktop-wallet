<template>
  <ModalWindow
    v-if="imageIndex !== null"
    modal-classes="SliderImageModal"
    @close="emitClose"
  >
    <SliderImage
      :images="images"
      :image-index="imageIndex"
      :show-navigation="showNavigation"
      :show-pagination="showPagination"
    />
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import SliderImage from './SliderImage'

export default {
  name: 'SliderImageModal',

  components: {
    ModalWindow,
    SliderImage
  },

  props: {
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

    showNavigation: {
      type: Boolean,
      required: false,
      default: true
    },

    showPagination: {
      type: Boolean,
      required: false,
      default: true
    },

    closeImage: {
      type: Function,
      required: true,
      default: null
    }
  },

  methods: {
    emitClose () {
      this.closeImage()
      this.$emit('close')
    }
  }
}
</script>

<style>
.SliderImageModal .ModalWindow__container__content {
  @apply .p-4;
}
.SliderImageModal article {
  @apply .flex .mt-0;
}
</style>
