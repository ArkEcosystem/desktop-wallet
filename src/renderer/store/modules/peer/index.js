
import ClientService from '@/services/client'
import i18n from '@/i18n'
// import PeerModel from '@/models/peer'

import current from './current'
import seed from './seed'
import discovery from './discovery'
import available from './available'
import system from './system'

const getBaseUrl = (peer) => `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

const logger = {
  ...console
}

export default {
  namespaced: true,

  modules: {
    seed,
    discovery,
    available,
    current,
    system
  },

  getters: {

    /**
     * Gets the current client for the peer.
     * @param {Object} peer The peer object
     * @return {Promise} The client
     */
    'peer/client': (getters) => ({ peer }) => {
      peer = peer || getters['peer/current/get']()

      if (!peer) return

      const client = new ClientService()
      client.host = getBaseUrl(peer)
      client.client.withOptions({ timeout: 3000 })

      return client
    }

  },

  actions: {

    /**
     * Make sure that the peer is valid for the current network.
     * @param {Peer} peer The peer object to be matched agains the current network.
     * @return
     */
    async 'peer/ensureStillValid' ({ rootGetters }, peer) {
      if (!peer) throw new Error('Not connected to peer')

      const networkConfig = await ClientService.fetchNetworkConfig(getBaseUrl(peer))
      if (networkConfig.nethash !== rootGetters['session/network'].nethash) {
        throw new Error('Wrong network')
      }
    },

    /**
     * Checks if the peer is still valid in the provided network.
     * @param {Object} peer The peer.
     * @param {Object} network The network.
     * @return {Boolean | Error} If the peer is compatible with the network.
     */
    async 'peer/checkNetwork' ({ getters }, { peer, network, nethash }) {
      const networkNethash = nethash || network.nethash
      let peerNethash

      try {
        peerNethash = await getters['peer/client']({ peer })
          .fetchNetworkConfig(getBaseUrl(peer))
          .nethash
      } catch (err) {
        logger.error('Could not get network config:' + err)
      }

      if (!peerNethash) {
        throw i18n.t('PEER.NO_CONNECT')
      } else if (peerNethash !== networkNethash) {
        return false
      }

      return true
    },

    /**
     * Update the peer object with it's status
     * @param {Object} peer The peer to be updated.
     * @return {(void | Error)} The status for the update.
     */
    async 'update' ({ dispatch }, peer) {
      let response

      try {
        response = await dispatch('peer/fetchStatus', peer)
      } catch (err) {
        logger.error(err)
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      if (!response) {
        logger.error('No status was fetched')
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      const { status, height, latency } = response

      peer = {
        ...peer,
        status,
        height,
        latency
      }

      return peer
    },

    /**
     * Fetch peer status and return it. This does not automatically add the status to the peer, nor saves the peer.
     * @param {Object} peer The peer that is going to be fetched.
     * @return {Object | Error} An object with the peer status fetched.
     */
    async 'peer/fetchStatus' ({ getters }, peer) {
      let client, status, latencyStart, latencyEnd

      try {
        latencyStart = performance.now()
        client = await getters['peer/client']({ peer })
        status = await client.fetchPeerStatus()
        latencyEnd = performance.now()
        if (!client || !status) throw new Error()
      } catch (err) {
        logger.error(err)
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      return {
        status: 'OK',
        height: status.height,
        latency: (latencyEnd - latencyStart).toFixed(0)
      }
    },

    /**
     * Validate custom peer, used to check it's acceptable to connect.
     * @param  {string} ip IP address without the schema.
     * @param  {string} host Host address, with or without the schema.
     * @param  {number} port Port number
     * @param  {string} nethash The network hash for the network which the peer belongs to
     * @param  {number} [ignoreNetwork=false] Set to true if validating a peer for other network
     * @param  {number} [timeout=3000] Default timeout for all the client requests.
     * @return {(Object|string)}
     */
    async 'peer/validate' ({ dispatch }, {
      host,
      ip,
      port,
      nethash,
      ignoreNetwork = false
    }) {
      const schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      const isHttps = schemeUrl && schemeUrl[1] === 'https://'

      let peer = {
        host,
        ip,
        port,
        isHttps
      }

      try {
        const isCompatible = await dispatch('peer/checkNetwork', {
          peer: peer,
          nethash: nethash
        })
        if (!isCompatible && !ignoreNetwork) return
        peer = await dispatch('update', peer)
      } catch (err) {
        logger.error(err)
      }

      return peer
    }
  }
}
