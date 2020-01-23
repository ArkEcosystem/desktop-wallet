import { shallowMount } from '@vue/test-utils'
import ModalLoader from '@/components/Modal/ModalLoader'

describe('ModalLoader', () => {
  it('should render modal', () => {
    const wrapper = shallowMount(ModalLoader, {
      propsData: {
        message: 'testing...'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
