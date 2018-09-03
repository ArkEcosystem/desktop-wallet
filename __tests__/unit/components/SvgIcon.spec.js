import { mount } from '@vue/test-utils'
import SvgIcon from '@/components/SvgIcon'

describe('SvgIcon', () => {
  it('should render', () => {
    const wrapper = mount(SvgIcon, {
      propsData: {
        name: 'test'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
