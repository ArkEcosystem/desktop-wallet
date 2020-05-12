import path from 'path'
import { sortBy } from 'lodash'
import { flatten } from '@/utils'
import imageManager from '@/services/image-manager'

export default {
  computed: {
    allImages () {
      const additional = this.additional ? this.additional : []

      return flatten([...Object.values(this.images), ...additional])
    },

    /**
     * Images grouped by category.
     * Instead of using the image path only, each image Object is composed by
     * the image path and its filename as title.
     */
    images () {
      const componentName = this.strings_snakeCase(this.$options.name).toUpperCase()
      const groups = imageManager.tree

      return this.categories.reduce((all, category) => {
        if (groups[category]) {
          const translatedCategory = this.$t(`${componentName}.${category.toUpperCase()}`)

          const images = groups[category].map(imagePath => {
            const { name } = path.parse(imagePath)
            return {
              title: name,
              imagePath
            }
          })
          all[translatedCategory] = sortBy(images, 'title')
        }

        return all
      }, {})
    },

    selectedItem () {
      return this.allImages.find(image => {
        if (image.name && this.selected) {
          if (image.name === this.selected.avatarName) {
            return true
          }
        }

        return image.imagePath === this.selected
      })
    }
  },

  methods: {
    select (selection) {
      if (selection.imagePath) {
        this.$emit('select', selection.imagePath)
      } else if (selection.component) {
        this.$emit('select', selection)
      } else {
        this.$emit('select', selection)
      }
    }
  }
}
