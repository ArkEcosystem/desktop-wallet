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
      type: 'number'
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
    ports: {
      type: 'object'
    },
    feeStatistics: {
      type: 'array'
    },
    constants: {
      type: 'object'
    },
    knownWallets: {
      type: 'object',
      default: {}
    }
  },
  required: ['name']
})
