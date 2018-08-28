export default {
  data: () => ({
    selectedItemId: null
  }),

  computed: {
    selectedItem: {
      get () {
        if (this.selectedItemId) {
          return this.images.find(image => image.id === this.selectedItemId)
        }

        return this.images.find(image => image.id === this.selected)
      },
      set ({ id }) {
        this.selectedItemId = id
      }
    }
  },

  methods: {
    select (item) {
      this.selectedItem = item
      this.$emit('select', item.id)
    }
  }
}
