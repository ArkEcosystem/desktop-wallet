import SynchronizerService from '@/services/synchronizer'

describe('Services > Synchronizer', () => {
  let synchronizer

  beforeEach(() => {
    synchronizer = new SynchronizerService({})
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
