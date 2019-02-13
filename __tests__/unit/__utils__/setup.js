import Vue from 'vue'
import VueTestUtils from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import eventBus from '@/plugins/event-bus'
import directives from '@/directives'
import filters from '@/filters'

require('babel-plugin-require-context-hook/register')()
global.Intl = require('intl')

HTMLCanvasElement.prototype.getContext = jest.fn()

Vue.use(VTooltip, {
  defaultHtml: false,
  defaultContainer: '#app'
})
Vue.use(directives)
Vue.use(filters)

VueTestUtils.config.mocks.$eventBus = eventBus
VueTestUtils.config.mocks.$client = {
  fetchDelegates: jest.fn()
}

VueTestUtils.config.mocks.assets_loadImage = jest.fn()
VueTestUtils.config.mocks.collections_filterChilds = jest.fn()
VueTestUtils.config.mocks.currency_subToUnit = jest.fn()
VueTestUtils.config.mocks.currency_format = jest.fn()
VueTestUtils.config.mocks.session_network = jest.fn()
VueTestUtils.config.mocks.session_profile = jest.fn()
VueTestUtils.config.mocks.wallet_fromRoute = {}
