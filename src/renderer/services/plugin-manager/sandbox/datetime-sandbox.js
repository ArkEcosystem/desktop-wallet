import { dayjs } from '@/services/datetime'

export function create (walletApi) {
  return () => {
    if (!walletApi.utils) {
      walletApi.utils = {}
    }

    walletApi.utils.datetime = dayjs
  }
}
