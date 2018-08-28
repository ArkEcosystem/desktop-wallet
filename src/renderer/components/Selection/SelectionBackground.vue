<template>
  <div class="SelectionBackground">
    <InputGrid
      :items="images"
      :max-visible-items="maxVisibleItems"
      :popup-header-text="$t('SelectionBackground.popupHeader')"
      :selected="selectedItem"
      item-key="imagePath"
      @input="select"
    />
  </div>
</template>

<script>
import path from 'path'
import imageManager from '@/services/image-manager'
import selectionMixin from './mixin-selection'
import selectionImageMixin from './mixin-selection-image'

export default {
  name: 'SelectionBackground',

  mixins: [selectionMixin, selectionImageMixin],

  props: {
    categories: {
      type: Array,
      required: false,
      default: () => ['textures', 'wallpapers']
    }
  },

  computed: {
    /**
     * Background images grouped by category.
     * Instead of using the image path only, each image Object is composed by
     * the image path and its filename as title.
     */
    images () {
      const groups = imageManager.tree

      return this.categories.reduce((all, category) => {
        if (groups[category]) {
          const translatedCategory = this.$i18n.t(`SelectionBackground.${category}`)

          all[translatedCategory] = groups[category].map(imagePath => {
            const { name } = path.parse(imagePath)
            return {
              title: name,
              imagePath
            }
          })
        }

        return all
      }, {})
    }
  }
}
</script>
