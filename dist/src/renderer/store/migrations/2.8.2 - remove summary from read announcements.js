export default (function (store) {
    var readAnnouncements = store.getters['announcements/read'];
    store.dispatch('announcements/markAsReadBulk', readAnnouncements);
    store.dispatch('app/setLatestAppliedMigration', '2.8.2');
});
//# sourceMappingURL=2.8.2 - remove summary from read announcements.js.map