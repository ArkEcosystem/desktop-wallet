import { mount } from '@vue/test-utils'
import Pagination from '@/components/Slider/Pagination'

describe('Pagination', () => {
  it('should render', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        currentIndex: 1,
        pageCount: 2
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should render an inactive button', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        currentIndex: 1,
        pageCount: 2
      }
    })
    const pagination = wrapper.find('.Pagination__page')
    expect(pagination.contains('.bg-theme-button')).toBeTruthy()
  })

  it('should render an active button', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        currentIndex: 0,
        pageCount: 2
      }
    })
    const pagination = wrapper.find('.Pagination__page')
    expect(pagination.contains('.bg-theme-button-active')).toBeTruthy()
  })
})
