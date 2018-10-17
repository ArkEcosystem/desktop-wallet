import clickOutside from './click-outside'

export default {
  install (Vue) {
    Vue.directive('click-outside', clickOutside)
  }
}
