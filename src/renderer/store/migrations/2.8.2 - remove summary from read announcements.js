export default store => {
  const readAnnouncements = store.getters['announcements/read']
  store.dispatch('announcements/markAsReadBulk', readAnnouncements)

  store.dispatch('app/setLatestAppliedMigration', '2.8.2')
}
