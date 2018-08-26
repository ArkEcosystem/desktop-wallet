<template>
  <div class="BackgroundSelection">
    <GridInput
      :items="backgrounds"
      :max-visible-items="maxVisibleItems"
      :popup-header-text="$t('BackgroundSelection.popupHeader')"
      item-key="imagePath"
      @input="select"
    />
  </div>
</template>

<script>
import path from 'path'
import imagesManager from '@/services/images-manager'
import GridInput from '@/components/GridInput'

export default {
  name: 'BackgroundSelection',

  components: {
    GridInput
  },

  props: {
    categories: {
      type: Array,
      require: false,
      default: () => ['textures', 'wallpapers']
    },
    maxVisibleItems: {
      type: Number,
      required: false,
      default: 10
    }
  },

  computed: {
    /**
     * Background images grouped by category.
     * Instead of using the image path only, each image Object is composed by
     * the image path and its filename as title.
     */
    backgrounds () {
      const groups = imagesManager.tree

      return this.categories.reduce((all, category) => {
        if (groups[category]) {
          const translatedCategory = this.$i18n.t(`BackgroundSelection.${category}`)

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
  },

  methods: {
    select ({ imagePath }) {
      this.$emit('select', imagePath)
    }
  }
}
</script>
