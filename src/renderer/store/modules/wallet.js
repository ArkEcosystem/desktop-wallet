import BaseModule from '../base'
import WalletModel from '@/models/wallet'

export default new BaseModule(WalletModel, {
  getters: {
    byAddress: state => address => state.all.find(model => model.address === address),
    byProfileId: state => profileId => state.all.filter(wallet => wallet.profileId === profileId)
  }
})
