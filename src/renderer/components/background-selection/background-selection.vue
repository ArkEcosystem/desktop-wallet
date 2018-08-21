<template>
  <ul class="background-selection list-reset flex flex-wrap -m-2">
    <background-selection-image
      v-for="background in backgrounds"
      :key="background"
      :url="background"
      :is-active="background === selected"
      @click="select($event)"
    />
  </ul>
</template>

<script>
import imagesManager from '@/services/images-manager'
import BackgroundSelectionImage from './background-selection-image'

export default {
  name: 'BackgroundSelection',
  categories: ['textures', 'wallpapers'],

  components: {
    BackgroundSelectionImage
  },

  props: {
    limit: {
      type: Number,
      required: false,
      default: null
    }
  },

  data: () => ({
    backgrounds: [],
    selected: null
  }),

  created () {
    let images = imagesManager.inline(this.$options.categories) || []

    if (this.limit && images.length > 0) {
      images = images.slice(0, this.limit)
    }

    this.backgrounds = images
  },

  methods: {
    select (url) {
      this.selected = url
      this.$emit('select', this.loadAssetImage(url))
    }
  }
}
</script>
