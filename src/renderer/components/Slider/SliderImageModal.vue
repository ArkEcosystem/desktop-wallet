<template>
  <ModalWindow
    v-if="imageIndex !== null"
    modal-classes="SliderImageModal"
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
