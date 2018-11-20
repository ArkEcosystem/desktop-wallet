import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    address: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    publicKey: {
      type: 'string'
    }
  }
})
