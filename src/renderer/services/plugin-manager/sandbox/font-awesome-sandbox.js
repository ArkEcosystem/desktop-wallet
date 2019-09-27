import * as FontAwesomeIcons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export function createFontAwesomeSandbox (walletApi) {
  return () => {
    walletApi.icons = {
      component: FontAwesomeIcon,
      icons: FontAwesomeIcons
    }
  }
}
