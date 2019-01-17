import { mount } from '@vue/test-utils'
import { ButtonLetter } from '@/components/Button'

describe('ButtonLetter', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ButtonLetter, {
      propsData: {
        value: 'Test'
      }
    })
  })

  it('should render', () => {
    expect(wrapper.contains('.ButtonLetter')).toBeTruthy()
  })

  it('should display the first chart', () => {
    expect(wrapper.vm.letter).toBe('T')
  })
})
