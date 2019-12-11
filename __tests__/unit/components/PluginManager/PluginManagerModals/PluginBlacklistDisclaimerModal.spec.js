import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginBlacklistDisclaimerModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()

let wrapper

beforeEach(() => {
  wrapper = mount(PluginBlacklistDisclaimerModal, {
    i18n,
    stubs: {
      Portal: true
    }
  })
})

describe('PluginBlacklistDisclaimerModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit continue event', () => {
      wrapper.vm.emitContinue()
      expect(wrapper.emitted('continue')).toBeTruthy()
    })

    it('should emit close event', () => {
      wrapper.vm.emitClose()
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })
})
