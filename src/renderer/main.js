import 'reflect-metadata'
import Vue from 'vue'
import VueVuelidateJsonschema from 'vue-vuelidate-jsonschema'
import Vuelidate from 'vuelidate'
import VTooltip from 'v-tooltip'
import VueGoodTablePlugin from 'vue-good-table'
import PortalVue from 'portal-vue'
import logger from 'electron-log'

import App from './App'
import i18n from './i18n'
import router from './router'
import store from './store'
import mixins from './mixins'
import filters from './filters'
import directives from './directives'

import alertEvents from '@/plugins/alert-events'
import apiClient from '@/plugins/api-client'
import synchronizer from '@/plugins/synchronizer'
import eventBus from '@/plugins/event-bus'
import pluginManager from '@/plugins/plugin-manager'

// Must be first to contain an empty Vue instance
Vue.use(pluginManager)

Vue.config.productionTip = false
Vue.logger = Vue.prototype.$logger = logger
Vue.prototype.$eventBus = eventBus

Vue.use(filters)
Vue.use(directives)
Vue.use(VueVuelidateJsonschema)
Vue.use(Vuelidate)
Vue.use(VueGoodTablePlugin)
Vue.use(VTooltip, {
  defaultHtml: false,
  defaultContainer: '#app'
})
Vue.use(alertEvents)
Vue.use(apiClient)
Vue.use(synchronizer)
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
