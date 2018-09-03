export default {
  methods: {
    collections_filterChilds (childName, ref = this) {
      return ref.$children.filter(child => {
        return child.$options.name === childName
      })
    }
  }
}
