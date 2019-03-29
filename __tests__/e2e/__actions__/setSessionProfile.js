module.exports = function createProfile (vue, profileId) {
  console.log('{setSessionProfile}', profileId)

  return vue.$store.dispatch('session/setProfileId', profileId)
}
