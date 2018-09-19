import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: (data) => data.name
    },
    avatar: {},
    background: {},
    currency: {
      type: 'string',
      minLength: 3,
      maxLength: 3
    },
    language: {},
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    // TODO rename to networkId
    network: {},
    theme: {}
  },
  required: ['avatar', 'background', 'currency', 'language', 'name', 'network', 'theme']
})
