import Vue from 'vue'
import VTooltip from 'v-tooltip'
import axios from 'axios'

import App from './App'
import i18n from './i18n'
import router from './router'
import store from './store'

import assets from '@/mixins/assets'
import electron from '@/mixins/electron'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios

Vue.use(VTooltip, {
  defaultHtml: false,
  defaultContainer: '#app'
})

Vue.mixin(assets)
Vue.mixin(electron)

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
