import { flatten, includes, isFunction, pullAll } from 'lodash'

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
      shorter: block * 4,
      block,
      // Number of milliseconds to wait to evaluate which actions should be run
      loop: block
    }

    return intervals
  }

  get $client () {
    return this.scope.$client
  }

  get $logger () {
    return this.scope.$logger
  }

  get $store () {
    return this.scope.$store
  }

  /**
   * @param {Object} config
   * @param {Vue} config.scope - Vue instance that would be synchronized
   */
  constructor (config) {
    this.scope = config.scope
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
    if (!isFunction(actionFn)) {
      throw new Error('[$synchronizer] action is not a function')
    }
    ;['default', 'focus'].forEach(mode => {
      const { interval } = config[mode]
      if (!interval) {
        throw new Error(`[$synchronizer] \`interval\` for \`${mode}\` mode should be a number bigger than 0`)
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
   * Pause these actions. They would not be dispatched until they are unpaused
   * or focused
   * @params {(...String|Array)} actions - ID of the actions to pause
   */
  pause (...actions) {
    this.paused = flatten(actions)
  }

  /**
   * Dispatch these paused actions again
   * @params {(...String|Array)} actions - ID of the actions to unpause
   */
  unpause (...actions) {
    pullAll(this.paused, flatten(actions))
  }

  /*
   * Starts to dispatch the actions periodically
   */
  ready () {
    /**
     * Invoke the action and update the last time it has been called, when
     * it has finished its sync or async execution
     * @param {Object} action
     */
    const call = async action => {
      action.isCalling = true
      await action.fn()
      action.calledAt = (new Date()).getTime()
      action.isCalling = false
    }

    /**
     * Run all the actions
     */
    const run = (options = {}) => {
      Object.keys(this.actions).forEach(actionId => {
        if (!includes(this.paused, actionId)) {
          const action = this.actions[actionId]

          if (!action.isCalling) {
            if (options.immediate) {
              call(action)
            } else {
              const mode = includes(this.focused, actionId) ? 'focus' : 'default'
              const { interval } = action[mode]
              const nextCall = action.calledAt + interval
              const now = (new Date()).getTime()

              if (nextCall <= now) {
                call(action)
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
    const { block, shorter, medium, longer, longest } = this.intervals

    const config = {
      announcements: {
        default: { interval: longest },
        focus: { interval: medium }
      },
      market: {
        default: { interval: shorter },
        focus: { interval: block }
      },
      wallets: {
        default: { interval: shorter },
        focus: { interval: block }
      },
      ledgerWallets: {
        default: { interval: shorter },
        focus: { interval: block }
      },
      delegates: {
        default: { interval: longer },
        focus: { interval: block }
      },
      peer: {
        default: { interval: medium },
        focus: { interval: shorter }
      }
    }
    config.contacts = config.wallets

    this.define('announcements', config.announcements, async () => {
      return this.$store.dispatch('announcements/fetch')
    })

    this.define('market', config.market, async () => {
      return this.$store.dispatch('market/refreshTicker')
    })

    // Since some users may have dozens of wallets:
    // TODO loads blocks and use them to:
    // - compute wallets balance
    // - check new transactions
    // TODO only the first time, then use blocks
    // TODO load the entire wallet if is new
    // TODO load everything periodically just in case the network has failed?
    this.define('wallets', config.wallets, async () => {
      const profile = this.scope.session_profile

      if (profile) {
        let wallets = this.$store.getters['wallet/byProfileId'](profile.id)

        return Promise.all(wallets.map(async wallet => {
          try {
            const walletData = await this.$client.fetchWallet(wallet.address)

            if (walletData) {
              const updatedWallet = { ...wallet, ...walletData }
              this.$store.dispatch('wallet/update', updatedWallet)
            }
          } catch (error) {
            this.$logger.error(error)
            // TODO the error could mean that the wallet isn't on the blockchain yet
            // this.$error(this.$t('COMMON.FAILED_FETCH', {
            //   name: 'wallet data',
            //   msg: error.message
            // }))
          }
        }))
      }
    })

    this.define('contacts', config.contacts, async () => {
      // console.log('defined CONTACTS')
    })

    this.define('delegates', config.delegates, async () => {
      // console.log('defined DELEGATES')
    })

    this.define('peer', config.peer, async () => {
      return this.$store.dispatch('peer/updateCurrentPeerStatus')
    })

    this.define('wallets:ledger', config.ledgerWallets, async () => {
      return this.$store.dispatch('ledger/reloadWallets')
    })
  }
}
