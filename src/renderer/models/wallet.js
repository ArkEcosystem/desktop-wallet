import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: (data) => data.address
    },
    address: {},
    isSendingEnabled: {
      type: 'boolean',
      default: false
    },
    passphrase: {
      format: () => null
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    profileId: {}
  },
  required: ['address', 'passphrase', 'name', 'profileId']
})
