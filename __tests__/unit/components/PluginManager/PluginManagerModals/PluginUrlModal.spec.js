import { shallowMount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import Vue from 'vue'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginUrlModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(PluginUrlModal, {
    i18n
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
})
