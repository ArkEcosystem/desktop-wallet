import { mount } from '@vue/test-utils'
import AlertMessage from '@/components/AlertMessage'

describe('AlertMessage', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(AlertMessage, {
      propsData: {
        duration: 5000
      }
    })
  })

  it('should render an alert', () => {
    expect(wrapper.contains('.AlertMessage')).toBeTruthy()
  })

  it('should render an error alert', () => {
    wrapper.vm.queueAlert({
      message: 'TEST ALERT',
      type: 'error'
    })
    expect(wrapper.contains('.AlertMessage--error')).toBeTruthy()
  })

  it('should render a success alert', () => {
    wrapper.vm.queueAlert({
      message: 'TEST ALERT',
      type: 'success'
    })
    expect(wrapper.contains('.AlertMessage--success')).toBeTruthy()
  })

  it('should render an info alert', () => {
    wrapper.vm.queueAlert({
      message: 'TEST ALERT',
      type: 'info'
    })
    expect(wrapper.contains('.AlertMessage--info')).toBeTruthy()
  })

  it('should render a warning alert', () => {
    wrapper.vm.queueAlert({
      message: 'TEST ALERT',
      type: 'warn'
    })
    expect(wrapper.contains('.AlertMessage--warn')).toBeTruthy()
  })

  it('should queue alert with different duration', () => {
    wrapper.vm.queueAlert({
      message: 'TEST ALERT',
      type: 'success',
      duration: 10000
    })
    expect(wrapper.vm.queue[0]).toHaveProperty('duration')
    expect(wrapper.vm.queue[0].duration).toBe(10000)
  })

  it('should have duration property and be a number', () => {
    const duration = wrapper.vm.$options.props.duration
    expect(duration).toBeObject()
    expect(duration.type).toBe(Number)
    expect(duration.default).toBe(5000)
  })
})
