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

  it('should render images in row (thumbnails)', () => {
    const sliderImage = wrapper.find('.SliderImage__container')
    expect(sliderImage.contains('.SliderImage__container--row')).toBeTruthy()
  })

  it('should render images in stack', () => {
    createWrapper(SliderImage, {
      isRow: false,
      images
    })
    const sliderImage = wrapper.find('.SliderImage__container')
    expect(sliderImage.contains('.SliderImage__container--stack')).toBeTruthy()
  })

  it('should render if has images', () => {
    expect(wrapper.vm.hasImages).toEqual(true)
  })

  it('should show navigation if "showNavigation" is true', () => {
    createWrapper(SliderImage, {
      isRow: true,
      showNavigation: true,
      images
    })
    const { showNavigation, pageCount } = wrapper.vm
    expect(showNavigation && pageCount > 1).toEqual(true)
  })

  it('should not show navigation if "showNavigation" is false', () => {
    createWrapper(SliderImage, {
      isRow: true,
      showNavigation: false,
      images
    })
    const { showNavigation, pageCount } = wrapper.vm
    expect(showNavigation && pageCount > 1).toEqual(false)
  })

  it('should show pagination if "showPagination" is true', () => {
    createWrapper(SliderImage, {
      isRow: true,
      showPagination: true,
      images
    })
    const { showPagination, pageCount } = wrapper.vm
    expect(showPagination && pageCount > 1).toEqual(true)
  })

  it('should not show pagination if "showPagination" is false', () => {
    createWrapper(SliderImage, {
      isRow: true,
      showPagination: false,
      images
    })
    const { showPagination, pageCount } = wrapper.vm
    expect(showPagination && pageCount > 1).toEqual(false)
  })

  it('should not show navigation and pagination if page count is less than 1', () => {
    createWrapper(SliderImage, {
      isRow: true,
      images: [
        'preview-1.png'
      ]
    })
    expect(wrapper.vm.pageCount > 1).toEqual(false)
  })

  it('should show two images per page', () => {
    createWrapper(SliderImage, {
      isRow: true,
      perPage: 2,
      images
    })
    expect(wrapper.vm.perPage).toBe(2)
  })
})
