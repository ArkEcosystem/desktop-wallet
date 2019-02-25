import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import ModalRename from '@/components/Modal'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = mount(ModalRename, {
    stubs: {
      Portal: true
    },
    i18n
  })
})
describe('ModalRename', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
