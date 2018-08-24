<template>
  <popup-modal
    title="Select background"
    @close="$emit('close')">
    <section class="background-selection-popup flex flex-col">
      <div class="background-selection-container overflow-y-auto">
        <ul
          v-for="(_, category) in backgrounds"
          :key="category"
          class="background-selection list-reset flex flex-wrap -m-2">
          <h4 class="w-full capitalize mt-4 mb-1 mx-2">{{ category }}</h4>

          <background-selection-image
            v-for="background in backgrounds[category]"
            :key="background"
            :url="background"
            :is-active="background === selected"
            @click="selected = $event"
          />
        </ul>
      </div>

      <div class="mt-5">
        <button
          :disabled="!selected"
          class="blue-button"
          @click="$emit('done', assets_loadImage(selected))">
          Done
        </button>
      </div>
    </section>
  </popup-modal>
</template>

<script>
import imagesManager from '@/services/images-manager'
import PopupModal from '@/components/popup-modal/popup-modal'
import BackgroundSelectionImage from './background-selection-image'

export default {
  name: 'BackgroundSelectionPopup',

  components: {
    PopupModal,
    BackgroundSelectionImage
  },

  data: () => ({
    backgrounds: {
      textures: {},
      wallpapers: {}
    },

    selected: null
  }),

  created () {
    // Get an array of files from subdirs
    let images = imagesManager.tree

    for (const category in this.backgrounds) {
      this.backgrounds[category] = images[category] || {}
    }
  }
}
</script>

<style scoped>
.background-selection-container {
  width: 320px;
  height: 350px;
}
</style>
