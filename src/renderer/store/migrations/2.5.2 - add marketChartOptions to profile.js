import { clone } from 'lodash'

export default store => {
  store.getters['profile/all'].forEach(profile => {
    if (profile.marketChartOptions === undefined) {
      const updatedProfile = clone(profile)

      updatedProfile.marketChartOptions = {
        isEnabled: profile.isMarketChartEnabled,
        isExpanded: true,
        period: 'day'
      }

      delete updatedProfile.isMarketChartEnabled

      store.dispatch('profile/update', updatedProfile)
    }
  })

  // All successful migrations should update this property
  store.dispatch('app/setLatestAppliedMigration', '2.5.2')
}
