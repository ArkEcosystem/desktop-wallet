import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: data => data.address
    },
    address: {
      type: 'string'
    },
    isSendingEnabled: {
      type: 'boolean',
      default: false
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    passphrase: {
      type: 'string',
      format: () => null
    },
    profileId: {}
  },
  required: ['address', 'isSendingEnabled', 'name', 'passphrase', 'profileId']
})
