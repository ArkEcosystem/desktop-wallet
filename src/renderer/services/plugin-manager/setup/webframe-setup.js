import WebFrame from '@/components/utils/WebFrame'

export function createWebFrameSetup (plugin) {
  return () => {
    plugin.globalComponents[WebFrame.name] = WebFrame
  }
}
