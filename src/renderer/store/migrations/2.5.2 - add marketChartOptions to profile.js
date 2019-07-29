import { clone, isUndefined } from 'lodash'

export default store => {
  store.getters['profile/all'].forEach(profile => {
    if (isUndefined(profile.marketChartOptions)) {
      const newProfile = clone(profile)

      newProfile.marketChartOptions = {
        isEnabled: profile.isMarketChartEnabled,
        isExpanded: true,
        period: 'day'
      }

      delete profile.isMarketChartEnabled

      store.dispatch('profile/update, newProfile')
    }
  })

  // All successful migrations should update this property
  store.dispatch('app/setLatestAppliedMigration', '2.5.2')
}
