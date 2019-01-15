export default store => {
  // All successful migrations should update this property
  store.dispatch('app/setLatestAppliedMigration', '2.2.0')
}
