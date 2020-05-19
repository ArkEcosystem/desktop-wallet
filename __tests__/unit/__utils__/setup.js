import Vue from 'vue'
import { config } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import eventBus from '@/plugins/event-bus'
import directives from '@/directives'
import filters from '@/filters'

require('babel-plugin-require-context-hook/register')()

// This Intl polyfill has some problems with number precision, so we store the original
// implementation to use it instead when that lack of accuracy is an issue
global.__Intl__ = global.Intl
global.Intl = require('intl')

HTMLCanvasElement.prototype.getContext = jest.fn()

Vue.use(VTooltip, {
  defaultHtml: false,
  defaultContainer: '#app'
})
Vue.use(directives)
Vue.use(filters)
Vue.config.ignoredElements = ['webview']

config.mocks.$eventBus = eventBus
config.mocks.$client = {
  fetchDelegates: jest.fn()
}

config.mocks.assets_loadImage = jest.fn()
config.mocks.collections_filterChildren = jest.fn()
config.mocks.currency_format = jest.fn()
config.mocks.currency_subToUnit = jest.fn()
config.mocks.electron_openExternal = jest.fn()
config.mocks.session_network = jest.fn()
config.mocks.session_profile = jest.fn()
config.mocks.wallet_fromRoute = {}
