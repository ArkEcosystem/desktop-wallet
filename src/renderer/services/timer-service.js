class TimerService {
  constructor () {
    this.timers = {}
  }

  /**
   * Start timer to fetch market data at specified interval.
   * @param  {String}   name Name of timer
   * @param  {Function} method Function to run on each tick
   * @param  {Number}   interval How often to run the timer (milliseconds)
   * @return {void}
   */
  start (name, method, interval = 60000) {
    if (this.timers[name]) {
      throw new Error('Timer already exists')
    }

    const options = {
      method,
      interval,
      timer: null
    }

    this.timerTick(name, options)
  }

  /**
   * Stop timer.
   * @param  {String} name Name of timer
   * @return {void}
   */
  stop (name) {
    if (!this.timers[name]) {
      throw new Error('Timer does not exist')
    }

    clearTimeout(this.timers[name].timer)
    delete this.timers[name]
  }

  /**
   * Restart timer.
   * @param  {String} name Name of timer
   * @return {void}
   */
  restart (name) {
    if (!this.timers[name]) {
      throw new Error('Timer does not exist')
    }

    const options = this.timers[name]
    this.stop(name)
    this.start(name, options.method, options.interval)
  }

  /**
   * Tick method to run each timer method and re-schedule the next interval.
   * @param  {String} name Name of timer
   * @param  {Object} options Options required for dealing with the timer
   * @return {void}
   */
  timerTick (name, options) {
    if (typeof options.method !== 'function') {
      throw new Error('Method is not a function')
    }
    if (typeof options.interval !== 'number') {
      throw new Error('Interval must be a number')
    }

    options.method()
    options.timer = setTimeout(() => this.timerTick(name, options), options.interval)
    this.timers[name] = options
  }

  /**
   * Clear all timers.
   * @return {void}
   */
  clear () {
    for (const name of Object.keys(this.timers)) {
      this.stop(name)
    }
  }
}

export default new TimerService()
