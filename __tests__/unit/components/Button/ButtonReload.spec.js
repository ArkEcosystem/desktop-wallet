import { mount } from '@vue/test-utils'
import { ButtonReload } from '@/components/Button'

describe('ButtonReload', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ButtonReload)
  })

  it('should render', () => {
    expect(wrapper.contains('.ButtonReload')).toBeTruthy()
  })

  it('should emit click event', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
