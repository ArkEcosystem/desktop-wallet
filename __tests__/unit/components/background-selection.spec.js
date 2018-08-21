import { mount, shallowMount } from '@vue/test-utils'
import BackgroundSelectionImage from '@/components/background-selection/background-selection-image'
import BackgroundSelectionPopup from '@/components/background-selection/background-selection-popup'
import BackgroundSelection from '@/components/background-selection/background-selection'

describe('BackgroundSelection', () => {
  let mocks

  beforeEach(() => {
    mocks = {
      loadAssetImage: jest.fn()
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
      expect(wrapper.contains('.background-selection-image')).toBe(true)
      expect(mocks.loadAssetImage).toHaveBeenCalledWith(url)
    })

    it('should emit click event', () => {
      const wrapper = mount(BackgroundSelectionImage, {
        propsData: {
          url: 'file.jpg'
        },
        mocks
      })
      const element = wrapper.find('.background-selection-image')
      element.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('BackgroundSelection', () => {
    it('should render component', () => {
      const wrapper = shallowMount(BackgroundSelection, {
        mocks
      })

      expect(wrapper.contains('.background-selection')).toBe(true)
    })

    it('should render component with images', () => {
      const wrapper = mount(BackgroundSelection, {
        mocks
      })

      expect(wrapper.findAll('.background-selection-image').length).toBeGreaterThan(1)
    })

    it('should render component with limited images', () => {
      const wrapper = mount(BackgroundSelection, {
        propsData: {
          limit: 3
        },
        mocks
      })

      expect(wrapper.findAll('.background-selection-image').length).toBe(3)
    })

    it('should emit select event', () => {
      const wrapper = mount(BackgroundSelection, {
        propsData: {
          limit: 1
        },
        mocks
      })
      const image = wrapper.find('.background-selection-image')
      image.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })

  describe('BackgroundSelectionPopup', () => {
    it('should render component', () => {
      const wrapper = shallowMount(BackgroundSelectionPopup, {
        mocks
      })

      expect(wrapper.contains('.background-selection-popup')).toBe(true)
    })

    it('should emit done event', () => {
      const wrapper = mount(BackgroundSelectionPopup, {
        mocks
      })
      const image = wrapper.find('.background-selection-image')
      image.trigger('click')
      const done = wrapper.find('.background-selection-popup button')
      done.trigger('click')
      expect(wrapper.emitted('done')).toBeTruthy()
    })
  })
})
