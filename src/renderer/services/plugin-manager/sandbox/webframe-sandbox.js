import WebFrame from '@/components/utils/WebFrame'

export function createWebFrameSandbox (walletApi) {
  return () => {
    if (!walletApi.components) {
      walletApi.components = {}
    }

    walletApi.components = {
      ...walletApi.components,
      WebFrame
    }
  }
}
