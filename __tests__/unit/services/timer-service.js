import timerService from '@/services/timer-service'

jest.useFakeTimers()

beforeEach(() => {
  timerService.clear()
})

describe('TimerService', () => {
  it('should be instance of TimerService', () => {
    expect(timerService.constructor.name).toBe('TimerService')
  })

  it('should start a timer', () => {
    timerService.start('testTimer', () => {}, 1)
    expect(timerService.timers['testTimer']).toBeTruthy()
  })

  it('should stop a timer', () => {
    timerService.start('testTimer', () => {}, 1)
    timerService.stop('testTimer')
    expect(timerService.timers['testTimer']).toBeFalsy()
  })

  it('should run a timer method', () => {
    const testRun = jest.fn()
    timerService.start('testTimer', testRun, 1)
    expect(testRun).toBeCalled()
    expect(testRun).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(testRun).toHaveBeenCalledTimes(2)
  })

  it('should restart a timer', () => {
    timerService.start('testTimer', () => {}, 1)
    const timer = timerService.timers['testTimer']
    timerService.restart('testTimer')
    expect(timerService.timers['testTimer'].timer).not.toBe(null)
    expect(timerService.timers['testTimer'].timer).not.toBe(timer.timer)
  })

  it('should fail if timer already exists', () => {
    timerService.start('testTimer', () => {}, 1)
    expect(() => {
      timerService.start('testTimer', () => {}, 1)
    }).toThrow(new Error('Timer already exists'))
  })

  it('should fail if invalid method type', () => {
    expect(() => {
      timerService.start('testTimer', null, 1)
    }).toThrow(new Error('Method is not a function'))
  })

  it('should fail if invalid interval type', () => {
    expect(() => {
      timerService.start('testTimer', () => {}, null)
    }).toThrow(new Error('Interval must be a number'))
  })
})
