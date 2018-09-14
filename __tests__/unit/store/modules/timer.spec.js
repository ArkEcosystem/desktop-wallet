import store from '@/store'
import { INTERVALS } from '@config'

describe('network store modules', () => {
  it('should start intervals', () => {
    store.dispatch('timer/start')

    expect(store.state.timer.timers).toBeArray()
    expect(store.state.timer.timers.length).toBe(Object.keys(INTERVALS).length)
  })

  it('should listen with a callback', () => {
    const callback = jest.fn()

    store.dispatch('timer/listen', {
      interval: 'short',
      immediate: true,
      callback
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should fail without a callback', () => {
    expect(() => store.dispatch('timer/listen', {
      interval: 'short',
      immediate: true
    })).toThrow()
  })

  it('should remove all intervals', () => {
    store.dispatch('timer/stopAll')

    expect(store.state.timer.timers).toBeEmpty()
  })
})
