import { mount, shallowMount } from '@vue/test-utils'
import { BackgroundSelection, BackgroundSelectionPopup, BackgroundSelectionImage } from '@/components/BackgroundSelection'

describe('BackgroundSelection', () => {
  let mocks

  beforeEach(() => {
    mocks = {
      assets_loadImage: jest.fn()
    }
  })

  describe('BackgroundSelectionImage', () => {
    it('should render component', () => {
      const url = 'file.jpg'
      const wrapper = mount(BackgroundSelectionImage, {
        propsData: {
          url
        },
        mocks
      })
      expect(wrapper.contains('.BackgroundSelectionImage')).toBe(true)
      expect(mocks.assets_loadImage).toHaveBeenCalledWith(url)
    })

    it('should emit click event', () => {
      const wrapper = mount(BackgroundSelectionImage, {
        propsData: {
          url: 'file.jpg'
        },
        mocks
      })
      const element = wrapper.find('.BackgroundSelectionImage')
      element.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('BackgroundSelection', () => {
    it('should render component', () => {
      const wrapper = shallowMount(BackgroundSelection, {
        mocks
      })

      expect(wrapper.contains('.BackgroundSelection')).toBe(true)
    })

    it('should render component with images', () => {
      const wrapper = mount(BackgroundSelection, {
        mocks
      })

      expect(wrapper.findAll('.BackgroundSelectionImage').length).toBeGreaterThan(1)
    })

    it('should render component with limited images', () => {
      const wrapper = mount(BackgroundSelection, {
        propsData: {
          limit: 3
        },
        mocks
      })

      expect(wrapper.findAll('.BackgroundSelectionImage').length).toBe(3)
    })

    it('should emit select event', () => {
      const wrapper = mount(BackgroundSelection, {
        propsData: {
          limit: 1
        },
        mocks
      })
      const image = wrapper.find('.BackgroundSelectionImage')
      image.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })

  describe('BackgroundSelectionPopup', () => {
    it('should render component', () => {
      const wrapper = shallowMount(BackgroundSelectionPopup, {
        mocks
      })

      expect(wrapper.contains('.BackgroundSelectionPopup')).toBe(true)
    })

    it('should emit done event', () => {
      const wrapper = mount(BackgroundSelectionPopup, {
        mocks
      })
      const image = wrapper.find('.BackgroundSelectionImage')
      image.trigger('click')
      const done = wrapper.find('.BackgroundSelectionPopup button')
      done.trigger('click')
      expect(wrapper.emitted('done')).toBeTruthy()
    })
  })
})
