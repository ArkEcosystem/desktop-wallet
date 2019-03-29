module.exports = function skipIntroductionScreens (vue) {
  console.log('{skipIntroductionScreens}')

  return vue.$store.dispatch('app/setHasSeenIntroduction', true)
}
