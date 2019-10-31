import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export function createFontAwesomeSetup (plugin) {
  return () => {
    plugin.globalComponents[FontAwesomeIcon.name] = FontAwesomeIcon
  }
}
