import BaseModule from '../base'
import WalletModel from '@/models/wallet'

export default new BaseModule(WalletModel, {
  getters: {
    byProfileId: state => profileId => state.all.filter(model => model.profileId === profileId)
  }
})
