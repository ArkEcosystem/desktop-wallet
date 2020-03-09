import { clone } from 'lodash'
import { TRANSACTION_GROUPS } from '@config'

export default store => {
  store.getters['profile/all'].forEach(profile => {
    const lastFees = profile.lastFees

    if (lastFees === undefined || Object.keys(lastFees).length === 0) {
      return
    }

    const updatedProfile = clone(profile)

    updatedProfile.lastFees = {
      [TRANSACTION_GROUPS.STANDARD]: {
        ...lastFees
      }
    }
    console.log(updatedProfile.lastFees)

    store.dispatch('profile/update', updatedProfile)
  })

  store.dispatch('app/setLatestAppliedMigration', '2.8.2')
}
