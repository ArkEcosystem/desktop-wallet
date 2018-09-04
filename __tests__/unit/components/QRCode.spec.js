import { shallowMount } from '@vue/test-utils'
import QRCodeModal from '@/components/QRCode'

describe('QRCode', () => {
  it('should render modal', () => {
    const wrapper = shallowMount(QRCodeModal, {
      propsData: {
        value: 'teste'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
