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
    balance: {
      type: 'integer',
      minimum: 0,
      default: 0
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
      type: ['string', 'null'],
      format: () => null
    },
    profileId: {},
    publicKey: {
      type: ['string', 'null']
    },
    secondPublicKey: {
      type: ['string', 'null']
    }
  },
  required: ['address', 'isSendingEnabled', 'name', 'profileId']
})
