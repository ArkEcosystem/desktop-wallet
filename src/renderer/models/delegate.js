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
    },
    voteWeight: {
      type: 'number'
    },
    producedBlocks: {
      type: 'integer'
    },
    missedBlocks: {
      type: 'integer'
    },
    rank: {
      type: 'integer'
    },
    productivity: {
      type: 'number'
    },
    approval: {
      type: 'number'
    }
  }
})
