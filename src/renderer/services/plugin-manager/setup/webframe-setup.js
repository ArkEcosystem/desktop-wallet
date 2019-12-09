import WebFrame from '@/components/utils/WebFrame'

export function create (plugin) {
  return () => {
    plugin.globalComponents[WebFrame.name] = WebFrame
  }
}
