import { mount } from '@vue/test-utils'
import { SliderImageModal } from '@/components/Slider'

const images = [
  'preview-1.png',
  'preview-2.png',
  'preview-3.png',
  'preview-4.png'
]

const stubs = {
  Portal: '<div><slot/></div>'
}

let wrapper
const createWrapper = (component, propsData) => {
  component = component || SliderImageModal
  propsData = propsData || {
    images,
    closeImage: jest.fn()
  }

  wrapper = mount(component, {
    propsData,
    stubs
  })
}

describe('SliderImageModal', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
