export default store => {
  store._IS_READY = false
  store.subscribe(mutation => {
    if (mutation.type === 'RESTORE_MUTATION') {
      store._vm.$root.$emit('vuex-persist:ready')
      store._IS_READY = true
    }
  })
}
