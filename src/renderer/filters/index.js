import truncate from './truncate'
import truncateMiddle from './truncate-middle'

export default {
  install (Vue) {
    Vue.filter('truncate', truncate)
    Vue.filter('truncateMiddle', truncateMiddle)
  }
}
