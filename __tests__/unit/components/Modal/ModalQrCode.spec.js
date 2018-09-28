import { shallowMount } from '@vue/test-utils'
import { ModalQrCode } from '@/components/Modal'

describe('ModalQrCode', () => {
  it('should render modal', () => {
    const wrapper = shallowMount(ModalQrCode, {
      propsData: {
        value: 'teste'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
