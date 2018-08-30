import { shallowMount } from '@vue/test-utils'
import QRCodeModal from '@/components/QRCode'

describe('QRCode', () => {
  const mocks = () => ({
    $t: jest.fn()
  })

  it('should render modal', () => {
    const wrapper = shallowMount(QRCodeModal, {
      propsData: {
        value: 'teste'
      },
      mocks: mocks()
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
