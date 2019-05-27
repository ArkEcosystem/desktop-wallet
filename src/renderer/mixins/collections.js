export default {
  methods: {
    collections_filterChildren (childName, ref = this) {
      ref = ref.$children.find(child => {
        return child.$options._componentTag === 'TransitionGroup'
      }) || ref

      return ref.$children.filter(child => {
        return child.$options.name === childName
      })
    }
  }
}
