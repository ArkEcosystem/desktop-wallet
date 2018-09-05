import path from 'path'
import { flatten, upperCase } from 'lodash'
import imageManager from '@/services/image-manager'

export default {
  computed: {
    allImages () {
      return flatten(Object.values(this.images))
    },
    /**
     * Images grouped by category.
     * Instead of using the image path only, each image Object is composed by
     * the image path and its filename as title.
     */
    images () {
      const componentName = upperCase(this.$options.name).replace(' ', '_')
      const groups = imageManager.tree

      return this.categories.reduce((all, category) => {
        if (groups[category]) {
          const translatedCategory = this.$i18n.t(`${componentName}.${category.toUpperCase()}`)

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
    },
    selectedItem () {
      return this.allImages.find(image => image.imagePath === this.selected)
    }
  },

  methods: {
    select ({ imagePath }) {
      this.$emit('select', imagePath)
    }
  }
}
