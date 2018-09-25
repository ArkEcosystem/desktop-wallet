import VueTestUtils from '@vue/test-utils'
import Vue from 'vue'

require('babel-plugin-require-context-hook/register')()

// TODO remove this and use a local Vue, like the tests of i18n mixin, to avoid
// the warning when it is done that way
VueTestUtils.config.mocks.$i18n = { t: jest.fn(msg => msg) }
VueTestUtils.config.mocks.i18n = { t: jest.fn(msg => msg) }
VueTestUtils.config.mocks.$t = jest.fn(msg => msg)
VueTestUtils.config.mocks.$eventBus = new Vue()
VueTestUtils.config.mocks.$client = {
  fetchDelegates: jest.fn()
}

VueTestUtils.config.mocks.assets_loadImage = jest.fn()
VueTestUtils.config.mocks.collections_filterChilds = jest.fn()
