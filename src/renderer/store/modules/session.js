import _ from 'lodash'
import db from '@/store/db/instance'
import DbModule from './db-module'
import Session from '@/models/session'

export default new DbModule('session', {
  getters: {
    get: state => (key) => {
      return _.first(state.all)[key]
    }
  },
  actions: {
    /**
     * Ensure there is a session in place.
     * @param  {State} state The current session state
     * @return {void}
     */
    async ensure (state) {
      try {
        if (!state.getters.all.length) {
          await this.dispatch('session/create', Session.fromObject({
            'current-profile': null
          }))
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Error ensuring default session: ', error)
      }
    },
    async set (state, data) {
      try {
        const found = await db.find(Session.id)

        if (found) {
          await this.dispatch('session/update', Session.fromObject({...found.data, ...data}))
        } else {
          await this.dispatch('session/create', Session.fromObject(data))
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Error saving the session: ', error)
      }
    },
    async reset (state) {
      try {
        if (_.first(state.getters.all)) {
          await this.dispatch('session/delete', _.first(state.getters.all))
        }
        await this.dispatch('session/ensure')
      } catch (error) {
        // TODO alert/toast component
        console.error('Error resetting session: ', error)
      }
    }
  }
})
