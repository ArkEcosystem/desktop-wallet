<template>
  <PopupModal
    title="Select background"
    @close="emitClose">
    <section class="BackgroundSelectionPopup flex flex-col">
      <div class="BackgroundSelectionPopup__container overflow-y-auto">
        <ul
          v-for="(_, category) in backgrounds"
          :key="category"
          class="BackgroundSelectionPopup__container__category list-reset flex flex-wrap -m-2">
          <h4 class="w-full capitalize mt-4 mb-1 mx-2">{{ category }}</h4>

          <BackgroundSelectionImage
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
          @click="emitDone">
          Done
        </button>
      </div>
    </section>
  </PopupModal>
</template>

<script>
import imagesManager from '@/services/images-manager'
import PopupModal from '@/components/PopupModal'
import BackgroundSelectionImage from './BackgroundSelectionImage'

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
  },

  methods: {
    emitClose () {
      this.$emit('close')
    },

    emitDone () {
      this.$emit('done', this.assets_loadImage(this.selected))
    }
  }
}
</script>

<style scoped>
.BackgroundSelectionPopup__container {
  width: 320px;
  height: 350px;
}
</style>
