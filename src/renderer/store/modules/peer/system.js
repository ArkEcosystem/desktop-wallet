
const logger = {
  ...console
}

export default {
  namespaced: true,
  actions: {

    /**
     * Updates the whole peer system, checking the current peer is still valid and updating status.
     * @param  {Object} [port]
     * @return {(Object|void)}
     */
    async 'update' ({ dispatch, rootGetters }) {
      let peer = rootGetters['peer/current/get']()

      if (!peer) {
        await dispatch('clear')
        await dispatch('peer/available/refresh')
        return
      }

      try {
        peer = await dispatch('peer/update', peer, { root: true })
        await dispatch('peer/current/set', { peer }, { root: true })
      } catch (error) {
        logger.error(error)
        await dispatch('clear')
        await dispatch('peer/available/refresh')
      }
    },

    /**
     * Fallback to seed peer, cleaning all the peer data.
     */
    async 'clear' ({ dispatch }) {
      await dispatch('peer/available/clear')
      await dispatch('peer/current/clear')
      await dispatch('peer/available/connectToBest', { skipIfCustom: false })
    }
  }
}
