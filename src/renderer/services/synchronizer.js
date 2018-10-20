import { flatten, includes, isFunction, pullAll, throttle } from 'lodash'

/**
 * This class adds the possibility to define actions (not to confuse with Vuex actions)
 * that could be dispatched using 2 modes: `default` and `focus`.
 *
 * Each mode has an interval configuration that establishes the delay until the
 * next update.
 */
export default class Synchronizer {
  get intervals () {
    const intervals = {
      longest: 20 * 60 * 1000,
      longer: 6 * 60 * 1000,
      medium: 2 * 60 * 1000,
      shorter: 30 * 1000,
      block: 8 * 1000, // ARK block production time
      shortest: 1000 // Not used yet
    }

    // Number of milliseconds to wait to evaluate which actions should be run
    intervals.loop = intervals.shortest

    return intervals
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

    this.actions[actionId] = {
      config,
      action: actionFn,
      dispatchers: {}
    }

    ;['default', 'focus'].forEach(mode => {
      const { interval } = config[mode]

      if (!interval) {
        throw new Error('[$synchronizer] `interval` should be a number bigger than 0')
      }

      this.actions[actionId].dispatchers[mode] = throttle(this.actions[actionId].action, interval, { leading: true })
    })
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
    const run = () => {
      Object.keys(this.actions).forEach(actionId => {
        if (!includes(this.paused, actionId)) {
          const mode = includes(this.focused, actionId) ? 'focus' : 'default'
          this.actions[actionId].dispatchers[mode]()
        }
      })
    }

    run()
    setInterval(run, this.intervals.loop)
  }

  defineAll () {
    const { block, shorter, medium, longer, longest } = this.intervals

    const announcements = {
      default: { interval: longest },
      focus: { interval: medium }
    }
    this.define('announcements', announcements, () => {
      this.$store.dispatch('announcements/fetch')
    })

    const market = {
      default: { interval: shorter },
      focus: { interval: block }
    }
    this.define('market', market, () => {
      this.$store.dispatch('market/refreshTicker')
    })

    const wallets = {
      default: { interval: shorter },
      focus: { interval: block }
    }
    // TODO refresh transactions if the balance changes, if not, load them
    // every n milliseconds, or create new action for transaction
    this.define('wallets', wallets, () => {
      const profile = this.scope.session_profile
      if (profile) {
        const refresh = async wallet => {
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
        }

        const wallets = this.$store.getters['wallet/byProfileId'](profile.id)
        wallets.forEach(refresh)
      }
    })

    const contacts = wallets
    this.define('contacts', contacts, () => {
      // console.log('defined CONTACTS')
    })

    const delegates = {
      default: { interval: longer },
      focus: { interval: block }
    }
    this.define('delegates', delegates, () => {
      // console.log('defined DELEGATES')
    })
  }
}
