import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { AlertMessage, AlertPlugin, AlertEvents } from '@/components/AlertMessage'

describe('AlertMessage', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(AlertMessage, {
      propsData: {
        duration: 4000
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
    expect(duration.default).toBe(4000)
  })
})

describe('AlertPlugin', () => {
  it('should has an install property', () => {
    expect(AlertPlugin).toHaveProperty('install')
  })

  it('should register all methods', () => {
    Vue.use(AlertPlugin)

    expect(Vue.error).toBeFunction()
    expect(Vue.success).toBeFunction()
    expect(Vue.info).toBeFunction()
    expect(Vue.warn).toBeFunction()
    expect(Vue.prototype.$error).toBeFunction()
    expect(Vue.prototype.$success).toBeFunction()
    expect(Vue.prototype.$info).toBeFunction()
    expect(Vue.prototype.$warn).toBeFunction()
  })
})

describe('AlertEvents', () => {
  it('should trigger an event', done => {
    Vue.use(AlertPlugin)

    const vue = new Vue()

    AlertEvents.$on('alert', async alert => {
      expect(alert).toBeObject()
      expect(alert.message).toBe('TEST ALERT')
      expect(alert.type).toBe('error')
      expect(alert.duration).toBe(6000)
      done()
    })

    vue.$error('TEST ALERT', 6000)
    AlertEvents.$emit = jest.fn()
    vue.$error('TEST ALERT', 6000)
    expect(AlertEvents.$emit).toHaveBeenCalledTimes(1)
  })
})
