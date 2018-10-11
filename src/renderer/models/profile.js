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
      type: 'string',
      minLength: 1
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
    language: {
      type: 'string',
      minLength: 1
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
    }
  },
  required: ['avatar', 'background', 'currency', 'language', 'name', 'networkId', 'theme']
})
