import WebFrame from '@/components/utils/WebFrame'

export function createWebFrameSandbox (walletApi) {
  return () => {
    walletApi.components = {
      ...walletApi.components || {},
      WebFrame
    }
  }
}
