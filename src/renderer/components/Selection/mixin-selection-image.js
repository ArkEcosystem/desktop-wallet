import { flatten } from 'lodash'

export default {
  computed: {
    allImages () {
      return flatten(Object.values(this.images))
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
