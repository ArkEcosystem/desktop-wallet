// Update the schema of profile avatars to be consistent and use `null` instead
// of `null` and `undefined` when to establish a "letter" avatar.
// It also fixes profiles that have been created, incorrectly, using `extraItems`
// from `SelectionAvatar`
export default store => {
  store.getters['profile/all'].forEach(profile => {
    if (profile.avatar === undefined || (profile.avatar && profile.avatar.onlyLetter)) {
      store.dispatch('profile/update', {
        ...profile,
        avatar: null
      })
    }
  })

  // All successful migrations should update this property
  store.dispatch('app/setLatestAppliedMigration', '2.4.0')
}
