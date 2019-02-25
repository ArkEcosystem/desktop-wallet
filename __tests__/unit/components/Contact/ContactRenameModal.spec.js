import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ContactRenameModal } from '@/components/Contact'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(ContactRenameModal, {
    propsData: {
      wallet: {}
    },
    i18n
  })
})
describe('ContactRenameModal', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
