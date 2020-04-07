
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
    async 'update' ({ dispatch, getters }) {
      let peer = getters['peer/current/get']()

      if (!peer) {
        await dispatch('system/clear')
        await dispatch('peers/refresh')
        return
      }

      try {
        peer = await dispatch('peer/update', peer, { root: true })
        await dispatch('peer/current/set', { peer }, { root: true })
      } catch (error) {
        logger.error(error)
        await dispatch('system/clear')
        await dispatch('peers/refresh')
      }
    },

    /**
     * Fallback to seed peer, cleaning all the peer data.
     */
    async 'clear' ({ dispatch }) {
      dispatch('peers/clear')
      dispatch('current/clear')
      await dispatch('peers/connectToBest', { skipIfCustom: false })
    }
  }
}
