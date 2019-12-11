export default store => {
  store.getters['profile/all'].forEach(profile => {
    const invalidFields = ['id', 'name', 'description', 'permissions', 'isEnabled']

    if (profile.pluginSortParams && invalidFields.includes(profile.pluginSortParams.field)) {
      store.dispatch('profile/update', {
        ...profile,
        pluginSortParams: {
          field: 'title',
          type: profile.pluginSortParams.type
        }
      })
    }
  })

  store.dispatch('app/setLatestAppliedMigration', '2.7.0')
}
