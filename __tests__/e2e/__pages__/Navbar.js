import PageObject from '../__utils__/page-object'

/**
 * Main navigation bar (`AppSidemenu` component)
 */
export default class Navbar extends PageObject {
  /**
   * The profile button
   */
  get $logo () {
    return '.AppSidemenu__logo'
  }
  /**
   * The wallets button
   */
  get $wallets () {
    return '#wallets.AppSidemenu__item'
  }
  /**
   * The contacts button
   */
  get $contacts () {
    return '#contacts.AppSidemenu__item'
  }
  /**
   * The announcements button
   */
  get $announcements () {
    return '#announcements.AppSidemenu__item'
  }
  /**
   * The alert button (new update available)
   */
  get $importantNotifications () {
    return '#importantNotifications.AppSidemenu__item'
  }
  /**
   * The settings button
   */
  get $settings () {
    return '#settings.AppSidemenu__item'
  }
  /**
   * The networks button
   */
  get $networks () {
    return '#networks.AppSidemenu__item'
  }
  /**
   * The profile button
   */
  get $profile () {
    return '.AppSidemenu__avatar'
  }
}
