import * as FontAwesomeIcons from '@fortawesome/free-solid-svg-icons'

export function create (walletApi) {
  return () => {
    walletApi.fontAwesomeIcons = FontAwesomeIcons
  }
}
