import { mount } from '@vue/test-utils'
import { ButtonClose } from '@/components/Button'

let wrapper
beforeEach(() => {
  wrapper = mount(ButtonClose, {
    propsData: {
      onClick: () => {}
    }
  })
})

describe('ButtonClose', () => {
  it('should render', () => {
    expect(wrapper.contains('.ButtonClose')).toBeTruthy()
  })

  it('should has property onClick and be a required function', () => {
    const onClick = wrapper.vm.$options.props.onClick
    expect(onClick).toBeObject()
    expect(onClick.required).toBeTruthy()
    expect(onClick.type).toBe(Function)
  })
})
