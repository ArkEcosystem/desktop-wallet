import { mount } from '@vue/test-utils'
import { ButtonGeneric } from '@/components/Button'

describe('ButtonGeneric', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ButtonGeneric, {
      propsData: {
        label: 'Test'
      }
    })
  })

  it('should render', () => {
    expect(wrapper.contains('.ButtonGeneric')).toBeTruthy()
  })

  it('should emit click event', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
