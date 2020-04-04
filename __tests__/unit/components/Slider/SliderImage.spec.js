import { mount } from '@vue/test-utils'
import { SliderImage } from '@/components/Slider'

const images = [
  'preview-1.png',
  'preview-2.png',
  'preview-3.png',
  'preview-4.png'
]

let wrapper
const createWrapper = (component, propsData) => {
  component = component || SliderImage
  propsData = propsData || {
    isRow: true,
    images
  }

  wrapper = mount(component, {
    propsData
  })
}

describe('SliderImage', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
