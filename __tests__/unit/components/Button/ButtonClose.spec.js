import { mount } from '@vue/test-utils'
import { ButtonClose } from '@/components/Button'

describe('ButtonClose', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ButtonClose)
  })

  it('should render', () => {
    expect(wrapper.contains('.ButtonClose')).toBeTruthy()
  })

  it('should emit click event', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
