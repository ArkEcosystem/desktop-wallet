import Vue from 'vue'
import VueVuelidateJsonschema from 'vue-vuelidate-jsonschema'
import Vuelidate from 'vuelidate'
import VTooltip from 'v-tooltip'
import VueGoodTablePlugin from 'vue-good-table'
import PortalVue from 'portal-vue'
import axios from 'axios'

import App from './App'
import i18n from './i18n'
import router from './router'
import store from './store'
import mixins from '@/mixins'

import apiClient from '@/plugins/api-client'
import alertEvents from '@/plugins/alert-events'
import eventBus from '@/plugins/event-bus'

Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$eventBus = eventBus

Vue.use(VueVuelidateJsonschema)
Vue.use(Vuelidate)
Vue.use(VueGoodTablePlugin)
Vue.use(VTooltip, {
  defaultHtml: false,
  defaultContainer: '#app'
})
Vue.use(alertEvents)
Vue.use(apiClient)
Vue.use(PortalVue)

Vue.mixin(mixins)

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
