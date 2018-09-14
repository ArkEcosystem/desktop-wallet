import VueTestUtils from '@vue/test-utils'
import Vue from 'vue'

require('babel-plugin-require-context-hook/register')()

VueTestUtils.config.mocks.$i18n = { t: jest.fn(msg => msg) }
VueTestUtils.config.mocks.i18n = { t: jest.fn(msg => msg) }
VueTestUtils.config.mocks.$t = jest.fn(msg => msg)
VueTestUtils.config.mocks.$eventBus = new Vue()
VueTestUtils.config.mocks.$client = {
  resource: () => ({
    all: () => ({
      data: {
        delegates: {}
      }
    })
  })
}

VueTestUtils.config.mocks.assets_loadImage = jest.fn()
VueTestUtils.config.mocks.collections_filterChilds = jest.fn()
