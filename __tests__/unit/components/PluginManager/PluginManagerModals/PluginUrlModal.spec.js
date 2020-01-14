import { mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import Vue from 'vue'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginUrlModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = mount(PluginUrlModal, {
    i18n,
    stubs: {
      Portal: true
    },
    sync: false
  })
})

Vue.use(Vuelidate)

describe('PluginUrlModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('form validation', () => {
    describe('url', () => {
      it('should switch from invalid to valid to invalid when url is changed', () => {
        wrapper.vm.$v.form.url.$model = 'https://github.com/foo/bar'

        expect(wrapper.vm.$v.form.url.isGitHubUrl).toBe(true)
        expect(wrapper.vm.$v.form.url.isAllowed).toBe(true)

        wrapper.vm.$v.form.url.$model = 'not-valid'

        expect(wrapper.vm.$v.form.url.isGitHubUrl).toBe(false)
        expect(wrapper.vm.$v.form.url.isAllowed).toBe(false)
      })
    })
  })

  describe('Computed properties', () => {
    describe('urlError', () => {
      it('should return an error if input is empty', () => {
        wrapper.vm.$v.form.url.$model = ''
        expect(wrapper.vm.urlError).toEqual('VALIDATION.REQUIRED')
      })

      it('should return an error if input is not an url', () => {
        wrapper.vm.$v.form.url.$model = 'not-an-url'
        expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.INVALID')
      })

      it('should return an error if input is not a github url', () => {
        wrapper.vm.$v.form.url.$model = 'https://not-github.com/'
        expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.NO_GITHUB')
      })

      it('should return an error if input is not a github repository url', () => {
        wrapper.vm.$v.form.url.$model = 'https://github.com/'
        expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.NO_GITHUB_REPOSITORY')
      })

      it('should return null if input is a valid github repository url', () => {
        wrapper.vm.$v.form.url.$model = 'https://github.com/foo/bar'
        expect(wrapper.vm.urlError).toEqual(null)
      })
    })
  })

  describe('Methods', () => {
    it('should emit close event', () => {
      wrapper.vm.emitClose()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit fetch-plugin event', () => {
      wrapper.vm.emitFetchPlugin()
      expect(wrapper.emitted('fetch-plugin', wrapper.vm.$v.form.url.$model)).toBeTruthy()
    })
  })
})
