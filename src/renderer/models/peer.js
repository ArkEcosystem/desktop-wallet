import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    ip: {
      type: 'string'
    },
    host: {
      type: ['string', 'null'],
      format: (value) => value.host || null
    },
    port: {
      type: ['integer', 'null']
    },
    p2pPort: {
      type: ['integer', 'null'],
      format: (value) => value.p2pPort || null
    },
    version: {
      type: 'string'
    },
    height: {
      type: 'integer'
    },
    status: {
      type: ['string', 'integer']
    },
    os: {
      type: 'string'
    },
    latency: {
      type: 'integer'
    },
    isCustom: {
      type: 'boolean',
      format: (value) => value.isCustom || false
    },
    lastUpdated: {
      type: ['date', 'null'],
      format: (value) => value.lastUpdated || null
    },
    isHttps: {
      type: 'boolean',
      format: (value) => value.isHttps || false
    }
  },
  required: ['ip', 'port', 'height', 'latency']
})
