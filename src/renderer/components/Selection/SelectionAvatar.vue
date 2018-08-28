<template>
  <InputGrid
    :items="images"
    :max-visible-items="maxVisibleItems"
    :popup-header-text="$t('SelectionAvatar.popupHeader')"
    :selected="selectedItem"
    item-key="imagePath"
    @input="select"
  />
</template>

<script>
import path from 'path'
import imageManager from '@/services/image-manager'
import selectionMixin from './mixin-selection'
import selectionImageMixin from './mixin-selection-image'

export default {
  name: 'SelectionAvatar',

  mixins: [selectionMixin, selectionImageMixin],

  props: {
    categories: {
      type: Array,
      required: false,
      // TODO replace it with 'avatars'
      default: () => ['wallpapers']
    }
  },

  computed: {
    /**
     * Avatar images
     */
    images () {
      const groups = imageManager.tree

      return this.categories.reduce((all, category) => {
        if (groups[category]) {
          const translatedCategory = this.$i18n.t(`SelectionAvatar.${category}`)

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
