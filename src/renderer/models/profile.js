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
      type: 'string'
    },
    background: {
      type: 'string'
    },
    currency: {
      type: 'string',
      minLength: 3,
      maxLength: 3
    },
    language: {
      type: 'string'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    networkId: {},
    theme: {
      type: 'string'
    }
  },
  required: ['avatar', 'background', 'currency', 'language', 'name', 'networkId', 'theme']
})
