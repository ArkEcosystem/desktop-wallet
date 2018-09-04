import VueTestUtils from '@vue/test-utils'

require('babel-plugin-require-context-hook/register')()

VueTestUtils.config.mocks.$i18n = { t: jest.fn(msg => msg) }
VueTestUtils.config.mocks.$t = jest.fn(msg => msg)

VueTestUtils.config.mocks.assets_loadImage = jest.fn()
