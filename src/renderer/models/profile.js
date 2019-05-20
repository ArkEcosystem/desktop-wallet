import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 16,
      maxLength: 16
    },
    avatar: {
      anyOf: [
        // Images provided by the app
        {
          type: 'string',
          minLength: 1
        },
        // Images provided by the plugins
        {
          type: 'object',
          properties: {
            avatarName: {
              type: 'string'
            },
            pluginId: {
              type: 'string'
            }
          }
        },
        // No avatar (use name first character)
        {
          type: 'null'
        }
      ]
    },
    background: {
      type: 'string',
      minLength: 1
    },
    currency: {
      type: 'string',
      minLength: 3,
      maxLength: 3
    },
    timeFormat: {
      type: 'string',
      default: 'Default'
    },
    isMarketChartEnabled: {
      type: 'boolean',
      format: data => data.isMarketChartEnabled !== undefined ? data.isMarketChartEnabled : true
    },
    language: {
      type: 'string',
      minLength: 1
    },
    bip39Language: {
      type: ['string', 'null'],
      format: data => data.bip39Language || null
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    networkId: {},
    theme: {
      type: 'string',
      minLength: 1
    },
    backgroundUpdateLedger: {
      type: 'boolean',
      format: data => data.backgroundUpdateLedger !== undefined ? data.backgroundUpdateLedger : true
    },
    broadcastPeers: {
      type: 'boolean',
      format: data => data.broadcastPeers !== undefined ? data.broadcastPeers : true
    },
    ledgerCache: {
      type: 'boolean',
      format: data => data.ledgerCache || false
    },
    transactionTableRowCount: {
      type: 'integer',
      format: data => data.transactionTableRowCount || 10
    },
    unconfirmedVotes: {
      type: 'array',
      format: data => data.unconfirmedVotes || []
    },
    walletLayout: {
      type: 'string',
      format: data => data.walletLayout || 'grid'
    },
    walletSortParams: {
      type: 'object',
      format: data => data.walletSortParams || { field: 'balance', type: 'desc' }
    },
    contactSortParams: {
      type: 'object',
      format: data => data.contactSortParams || { field: 'name', type: 'asc' }
    },
    pluginSortParams: {
      type: 'object',
      format: data => data.pluginSortParams || { field: 'id', type: 'asc' }
    }
  },
  required: ['background', 'currency', 'language', 'name', 'networkId', 'theme']
})
