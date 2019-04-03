import PageObject from '../__utils__/page-object'

export default class NewProfile extends PageObject {
  get $instructions () {
    return '.ProfileNew__instructions'
  }
}
