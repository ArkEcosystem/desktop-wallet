import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export function create (plugin) {
  return () => {
    plugin.globalComponents[FontAwesomeIcon.name] = FontAwesomeIcon
  }
}
