import Vue from 'vue'

import SplashScreen from './SplashScreen.vue'
import i18n from './i18n'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { SplashScreen },
  i18n,
  template: '<SplashScreen/>'
}).$mount('#splashscreen')
