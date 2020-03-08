import { shallowMount } from '@vue/test-utils'
import { AppFooter } from '@/components/App'

let wrapper
const translation = 'Mock Translation'
const createWrapper = () => {
  wrapper = shallowMount(AppFooter, {
    mocks: {
      $t: () => translation
    },
    stubs: {
      PortalTarget: true
    }
  })
}

describe('AppFooter', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.AppFooter')).toBeTruthy()
  })

  it('should display correct translation', () => {
    expect(wrapper.vm.text).toBe(translation)
    expect(wrapper.text()).toBe(translation)
  })
})
