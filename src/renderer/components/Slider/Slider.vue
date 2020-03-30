<template>
  <div
    v-if="hasImages"
    class="Slider"
  >
    <SliderImage
      :images="data"
      :is-row="true"
      @openimageclick="openImage"
    />
    <ModalWindow
      v-if="selectedImage !== null"
      modal-classes="Slider-Modal"
      aacontainer-classes="Slider-Modal max-w-md"
      @close="emitClose"
    >
      <SliderImage
        :images="data"
        :is-row="false"
        :image-index="selectedImage"
      />
    </ModalWindow>
  </div>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import SliderImage from './SliderImage'

export default {
  name: 'Slider',

  components: {
    ModalWindow,
    SliderImage
  },

  props: {
    data: {
      type: Array,
      required: true,
      default: null
    }
  },

  data: () => ({
    selectedImage: null
  }),

  computed: {
    hasImages () {
      return this.data && this.data.length > 0
    }
  },

  methods: {
    emitClose () {
      this.selectedImage = null
      this.$emit('close')
    },

    openImage (selectedImage) {
      this.selectedImage = selectedImage
    }
  }
}
</script>

<style>
.Slider-Modal .ModalWindow__container__content {
  @apply .p-4;
}
.Slider-Modal article {
  @apply .flex .mt-0;
}
</style>
