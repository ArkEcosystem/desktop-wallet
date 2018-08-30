export default {
  methods: {
    collections_filterChilds (childName) {
      return this.$children.filter(child => {
        return child.$options.name === childName
      })
    }
  }
}
