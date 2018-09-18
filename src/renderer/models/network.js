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
    apiVersion: {
      type: 'number'
    },
    market: {
      type: 'object'
    },
    explorer: {},
    token: {},
    symbol: {},
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
    }
  },
  required: ['name']
})
