import _ from 'lodash'
import DbModule from './db-module'
import Session from '@/models/session'
import Profile from '@/models/profile'

const getters = {
  /**
   * Current session
   * @return {Session}
   */
  current: state => {
    return state.all[0]
  },
  /**
   * Return the profile that is being used in this session
   * @return {Profile}
   */
  currentProfile (state, getters, rootState, rootGetters) {
    if (getters.current && getters.current.profileId) {
      return rootGetters['profiles/byId'](getters.current.profileId)
    }
    return null
  }
}

// Session has all the properties of Profile, except `name``
const profileProperties = _.pull(Object.keys(Profile.schema.properties), ['name'])

// Add getters for all the properties of the session and fallback to profile
profileProperties.forEach(property => {
  getters[property] = (state, { current, currentProfile }) => {
    return current[property] || (currentProfile ? currentProfile[property] : null)
  }
})

export default new DbModule('session', {
  getters,
  actions: {
    /**
     * Ensure there is a session in place
     * @param  {State} state - The current session state
     * @return {void}
     */
    async ensure (state) {
      try {
        if (!state.getters.all.length) {
          await this.dispatch('session/create', Session.fromObject({
            profileId: null
          }))
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Error ensuring default session: ', error)
      }
    },
    /**
     * Generic setter
     * @param {Object} state
     * @param {Object} data - The properties to modify using { key: value }
     * @return {void}
     */
    async set (state, data) {
      try {
        const current = this.getters['session/current']

        if (current) {
          await this.dispatch('session/update', Session.fromObject({ ...current.data, ...data }))
        } else {
          await this.dispatch('session/create', Session.fromObject(data))
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Error saving the session: ', error)
      }
    },
    /**
     * Resets all the data, except the `profileId` associated with the session
     */
    async reset (state) {
      const current = this.getters['session/current']

      try {
        if (current) {
          const resetSession = Session.fromObject({ profileId: current.profileId })
          await this.dispatch('session/update', resetSession)
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Error resetting session: ', error)
      }
    }
  }
})
