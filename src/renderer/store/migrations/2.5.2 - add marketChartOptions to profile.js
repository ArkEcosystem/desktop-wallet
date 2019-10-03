import { isUndefined } from 'lodash'
import { clone } from '@arkecosystem/utils'

export default store => {
  store.getters['profile/all'].forEach(profile => {
    if (isUndefined(profile.marketChartOptions)) {
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
