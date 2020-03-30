<template>
  <ModalWindow
    v-if="imageIndex !== null"
    modal-classes="SliderImageModal"
    aacontainer-classes="SliderImageModal max-w-md"
    @close="emitClose"
  >
    <SliderImage
      :images="images"
      :is-row="false"
      :image-index="imageIndex"
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

    isRow: {
      type: Boolean,
      required: false,
      default: false
    },

    imageIndex: {
      type: Number,
      required: false,
      default: 0
    },

    closeTrigger: {
      type: Function,
      required: true,
      default: null
    }
  },

  methods: {
    emitClose () {
      this.closeTrigger()
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
