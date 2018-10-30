import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ModalQrCode } from '@/components/Modal'

describe('ModalQrCode', () => {
  it('should render modal', () => {
    const i18n = useI18nGlobally()
    const wrapper = shallowMount(ModalQrCode, {
      i18n,
      propsData: {
        value: 'teste'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
