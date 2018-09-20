import truncateMiddle from './truncate-middle'

export default {
  install (Vue) {
    Vue.filter('truncateMiddle', truncateMiddle)
  }
}
