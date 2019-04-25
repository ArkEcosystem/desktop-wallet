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
    blocks: {
      type: 'object',
      properties: {
        missed: {
          type: 'integer'
        },
        produced: {
          type: 'integer'
        }
      }
    },
    production: {
      type: 'object',
      properties: {
        approval: {
          type: 'number'
        }
      }
    },
    forged: {
      type: 'object',
      properties: {
        fees: {
          type: 'integer'
        },
        rewards: {
          type: 'integer'
        },
        total: {
          type: 'integer'
        }
      }
    },
    rank: {
      type: 'integer'
    }
  }
})
