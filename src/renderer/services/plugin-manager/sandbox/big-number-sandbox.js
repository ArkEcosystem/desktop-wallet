import BigNumber from '@/plugins/bignumber'

export function create (walletApi) {
  return () => {
    if (!walletApi.utils) {
      walletApi.utils = {}
    }

    walletApi.utils.bigNumber = BigNumber
  }
}
