export default store => {
  console.log('MIGRASGION 1', store)
  store.dispatch('app/setLatestAppliedMigration', '2.0.0')
}
