export default {
  methods: {
    collections_filterChildren (childName, ref = this) {
      return ref.$children.filter(child => {
        return child.$options.name === childName
      })
    }
  }
}
