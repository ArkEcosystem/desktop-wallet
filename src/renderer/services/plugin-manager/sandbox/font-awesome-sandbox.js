import * as FontAwesomeIcons from '@fortawesome/free-solid-svg-icons'

export function createFontAwesomeSandbox (walletApi) {
  return () => {
    walletApi.fontAwesomeIcons = FontAwesomeIcons
  }
}
