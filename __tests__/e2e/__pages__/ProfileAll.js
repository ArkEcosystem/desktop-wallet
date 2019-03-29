import PageObject from '../__utils__/page-object'

export default class ProfileAll extends PageObject {
  /**
   * Header includes the total balance of all profiles
   */
  get $header () {
    return this.$('.ProfileAll > h3')
  }
  /**
   * Body of the page (add profile button + profiles)
   */
  get $profileContainer () {
    return this.$$('.ProfileAll__grid')
  }
  /**
   * All profiles
   */
  get $profiles () {
    return 'div.ProfileAll__grid__profile'
  }
  /**
   * Add profile button
   */
  get $addProfile () {
    return 'a.ProfileAll__grid__profile:first-child'
  }
  /**
   * The current active profile
   */
  get $selectedProfile () {
    return '.ProfileAll__grid__profile--selected'
  }
}
