import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    ip: {
      type: 'string'
    },
    port: {
      type: 'integer'
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
    delay: {
      type: 'integer'
    },
    isCustom: {
      type: 'boolean'
    },
    lastUpdated: {
      type: 'date'
    }
  },
  required: ['ip', 'port', 'version', 'height', 'status', 'delay']
})
