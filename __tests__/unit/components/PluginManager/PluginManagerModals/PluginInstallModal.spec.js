import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginInstallModal } from '@/components/PluginManager/PluginManagerModals'

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn()
  }
}))

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(PluginInstallModal, {
    i18n,
    propsData: {
      plugin: {
        id: 'test'
      }
    }
  })
})

describe('PluginInstallModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
