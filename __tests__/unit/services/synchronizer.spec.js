import SynchronizerService from '@/services/synchronizer'

describe('Services > Synchronizer', () => {
  let synchronizer

  beforeEach(() => {
    synchronizer = new SynchronizerService({})
  })

  describe('define', () => {
    const actionId = 'example'
    const actionFn = jest.fn()

    it('requires the `default` mode configuration', () => {
      const config = {
        focus: { interval: 1000 }
      }

      expect(() => synchronizer.define(actionId, config, actionFn)).not.toThrow(/default.*mode/)
    })

    it('requires the `focus` mode configuration', () => {
      const config = {
        default: { interval: 10000 }
      }

      expect(() => synchronizer.define(actionId, config, actionFn)).not.toThrow(/focus.*mode/)
    })

    it('stores the action by ID', () => {
      const config = {
        default: { interval: 10000 },
        focus: { interval: 1000 }
      }

      synchronizer.define(actionId, config, actionFn)

      expect(synchronizer).toHaveProperty(`actions.${actionId}`, {
        calledAt: 0,
        isCalling: false,
        fn: actionFn,
        ...config
      })
    })
  })

  describe('focus', () => {
    it('should add the actions to the `focused` Array', () => {
      synchronizer.focused = []
      synchronizer.focus('example')
      expect(synchronizer).toHaveProperty('focused', ['example'])

      synchronizer.focused = []
      synchronizer.focus(['example'])
      expect(synchronizer).toHaveProperty('focused', ['example'])
    })

    it('should remove the actions from the `paused` the Array', () => {
      synchronizer.paused = ['example', 'other']
      synchronizer.focus('example')
      expect(synchronizer).toHaveProperty('paused', ['other'])

      synchronizer.paused = ['example', 'other']
      synchronizer.focus(['example'])
      expect(synchronizer).toHaveProperty('paused', ['other'])
    })
  })

  describe('pause', () => {
    it('should add the actions to the `paused` Array', () => {
      synchronizer.paused = []
      synchronizer.pause('example')
      expect(synchronizer).toHaveProperty('paused', ['example'])

      synchronizer.paused = []
      synchronizer.pause(['example'])
      expect(synchronizer).toHaveProperty('paused', ['example'])
    })
  })

  describe('unpause', () => {
    it('should remove the actions from the `paused` the Array', () => {
      synchronizer.paused = ['example', 'other']
      synchronizer.unpause('example')
      expect(synchronizer).toHaveProperty('paused', ['other'])

      synchronizer.paused = ['example', 'other']
      synchronizer.unpause(['example'])
      expect(synchronizer).toHaveProperty('paused', ['other'])
    })
  })
})
