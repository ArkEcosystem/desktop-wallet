import store from '@/store'
import { INTERVALS } from '@config'

describe('TimerModule', () => {
  it('should start intervals', () => {
    store.dispatch('timer/start')

    expect(store.state.timer.timers).toBeArray()
    expect(store.state.timer.timers.length).toBe(Object.keys(INTERVALS).length)
  })

  describe('subscribe/unsubscribe', () => {
    let id
    const callback = jest.fn()

    beforeAll(async () => {
      id = await store.dispatch('timer/subscribe', {
        interval: 'short',
        immediate: true,
        callback
      })
    })

    it('should subscribe', () => {
      expect(callback).toHaveBeenCalled()
      expect(id).toBeTruthy()
      expect(store.state.timer.observers).toContainKey(id)
    })

    it('should unsubscribe', async () => {
      await store.dispatch('timer/unsubscribe', id)
      expect(store.state.timer.observers).toBeEmpty()
    })
  })

  it('should fail without a callback', () => {
    expect(() => store.dispatch('timer/subscribe', {
      interval: 'short',
      immediate: true
    })).toThrow()
  })

  it('should remove all intervals', () => {
    store.dispatch('timer/stopAll')

    expect(store.state.timer.timers).toBeEmpty()
  })
})
