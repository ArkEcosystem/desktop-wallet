import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: (data) => data.id || data.name
    },
    name: {},
    title: {},
    server: {},
    description: {},
    imagePath: {},
    slip44: {
      type: ['string', 'number']
    },
    apiVersion: {
      type: 'number'
    },
    market: {
      type: 'object'
    },
    explorer: {},
    token: {
      type: 'string'
    },
    subunit: {
      type: 'string'
    },
    symbol: {
      type: 'string'
    },
    fractionDigits: {
      type: 'integer'
    },
    nethash: {},
    version: {
      type: 'number'
    },
    wif: {
      type: 'number'
    },
    ports: {
      type: 'object'
    },
    feeStatistics: {
      type: 'object'
    },
    constants: {
      type: 'object'
    },
    vendorField: {
      type: 'object',
      properties: {
        maxLength: {
          type: 'integer'
        }
      }
    },
    knownWalletsUrl: {
      type: ['string', 'null']
    },
    knownWallets: {
      type: 'object',
      default: {}
    }
  },
  required: ['name']
})
