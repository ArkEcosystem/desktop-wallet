import { pullAll } from 'lodash'
import { flatten } from '@/utils'
import { announcements, fees, ledger, market, peer, wallets } from './synchronizer/'
/**
 * This class adds the possibility to define actions (not to confuse with Vuex actions)
 * that could be dispatched using 2 modes: `default` and `focus`.
 *
 * Each mode has an interval configuration that establishes the delay until the
 * next update:
 *  - `focus` should be used on sections that display that kind of data to users
 *  - `default` should be used to check if new data is available
 *
 * There is also a way to pause and unpause the synchronization that is useful
 * for not executing actions when the users do not need fresh data.
 */
export default class Synchronizer {
  get intervals () {
    // ARK block production time
    const block = 8000

    const intervals = {
      longest: block * 300,
      longer: block * 100,
      medium: block * 25,
      shorter: block * 10,
      shortest: block * 3,
      block,
      // Number of milliseconds to wait to evaluate which actions should be run
      loop: 2000
    }

    return intervals
  }

  get config () {
    const { loop, shortest, shorter, medium, longer, longest } = this.intervals

    const config = {
      announcements: {
        default: { interval: longest, delay: loop * 6 },
        focus: { interval: medium }
      },
      delegates: {
        default: { interval: longer, delay: loop * 3 },
        focus: { interval: longer }
      },
      fees: {
        default: { interval: null },
        focus: { interval: shorter }
      },
      ledgerWallets: {
        default: { interval: shorter },
        focus: { interval: shortest }
      },
      market: {
        default: { interval: medium },
        focus: { interval: shorter }
      },
      peer: {
        default: { interval: longer },
        focus: { interval: shorter }
      },
      wallets: {
        default: { interval: shorter },
        focus: { interval: shortest }
      }
    }
    config.contacts = config.wallets

    return config
  }

  get $client () {
    return this.scope.$client
  }

  get $store () {
    return this.scope.$store
  }

  /**
   * @param {Object} config
   * @param {Vue} config.scope - Vue instance that would be synchronized
   */
  constructor ({ scope }) {
    this.scope = scope
    this.actions = {}
    this.focused = []
    this.paused = []
  }

  /**
   * Define an action that would be called later periodically
   * @param {String} actionId
   * @param {Object} config
   * @param {Function} actionFn
   */
  define (actionId, config, actionFn) {
    if (typeof actionFn !== 'function') {
      throw new Error('[$synchronizer] action is not a function')
    }
    ;['default', 'focus'].forEach(mode => {
      const { interval } = config[mode]
      if (!interval && interval !== null) {
        throw new Error(`[$synchronizer] \`interval\` for \`${mode}\` mode should be a Number bigger than 0 (or \`null\` to ignore it)`)
      }
    })

    this.actions[actionId] = {
      calledAt: 0,
      isCalling: false,
      fn: actionFn,
      ...config
    }
  }

  /**
   * Focus on these actions: instead of refreshing their data on the normal pace,
   * change to the `focus` frequency.
   *
   * Focusing on 1 or several actions, unfocused the rest
   * @params {(...String|Array)} actions - ID of the actions to focus on
   */
  focus (...actions) {
    this.focused = flatten(actions)
    this.unpause(this.focused)
  }

  /**
   * Add 1 or more actions to additionally focus
   * @params {(...String|Array)} actions - ID of the actions to focus on
   */
  appendFocus (...actions) {
    this.focused = flatten([actions, this.focused])
    this.unpause(actions)
  }

  /**
   * Remove action from focus
   * @params {(...String|Array)} actions - ID of the actions to focus on
   */
  removeFocus (...actions) {
    pullAll(this.focused, flatten(actions))
  }

  /**
   * Pause these actions. They would not be dispatched until they are unpaused
   * or focused
   * @params {(...String|Array)} actions - ID of the actions to pause
   */
  pause (...actions) {
    this.paused = flatten(actions)
  }

  /**
   * Enable these paused actions again
   * @params {(...String|Array)} actions - ID of the actions to unpause
   */
  unpause (...actions) {
    pullAll(this.paused, flatten(actions))
  }

  /**
   * Trigger these actions 1 time.
   * As a consequence the interval of those actions is updated.
   * @params {(...String|Array)} actions - ID of the actions to unpause
   */
  trigger (...actions) {
    flatten(actions).forEach(actionId => this.call(actionId))
  }

  /**
   * Invoke the action and update the last time it has been called, when
   * it has finished its sync or async execution
   * @param {String} actionId
   */
  async call (actionId) {
    const action = this.actions[actionId]
    if (!action) {
      return
    }

    action.isCalling = true
    await action.fn()
    action.calledAt = (new Date()).getTime()
    action.isCalling = false
  }

  /*
   * Starts to dispatch the actions periodically
   */
  ready () {
    /**
     * Run all the actions
     */
    const run = (options = {}) => {
      Object.keys(this.actions).forEach(actionId => {
        if (!this.paused.includes(actionId)) {
          const action = this.actions[actionId]

          if (!action.isCalling) {
            if (options.immediate) {
              this.call(actionId)
            } else {
              const mode = this.focused.includes(actionId) ? 'focus' : 'default'
              const { interval } = action[mode]

              // A `null` interval means no interval, so the action does not run
              if (interval !== null) {
                // Delay the beginning of the periodic action run
                if (!action.calledAt && action[mode].delay) {
                  action.calledAt += action.delay
                }

                const nextCallAt = action.calledAt + interval
                const now = (new Date()).getTime()

                if (nextCallAt <= now) {
                  this.call(actionId)
                }
              }
            }
          }
        }
      })
    }

    const runLoop = () => {
      // Using `setTimeout` instead of `setInterval` allows waiting to the
      // completion of async functions
      setTimeout(() => {
        run()
        runLoop()
      }, this.intervals.loop)
    }

    // Run the first time
    run({ immediate: true })
    runLoop()
  }

  defineAll () {
    this.define('announcements', this.config.announcements, async () => {
      await announcements(this)
    })

    // TODO focus on contacts only (currently wallets and contacts are the same)
    // this.define('contacts', this.config.contacts, async () => {
    //   console.log('defined CONTACTS')
    // })

    // NOTE: not used currently
    // this.define('delegates', this.config.delegates, async () => {
    //   await delegates(this)
    // })

    this.define('fees', this.config.fees, async () => {
      await fees(this)
    })

    this.define('market', this.config.market, async () => {
      await market(this)
    })

    this.define('peer', this.config.peer, async () => {
      await peer(this)
    })

    // TODO allow focusing on 1 wallet alone, while using the normal mode for the rest
    this.define('wallets', this.config.wallets, async () => {
      await wallets(this)
    })

    this.define('wallets:ledger', this.config.ledgerWallets, async () => {
      await ledger(this)
    })
  }
}
