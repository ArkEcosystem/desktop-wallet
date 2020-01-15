const delegates = {
  data: [
    { rank: 1, username: 'first', approval: '1' },
    { rank: 2, username: 'second', approval: '2' },
    { rank: 3, username: 'third', approval: '3' }
  ]
}

const dd = delegates.data

delegates.meta = {
  totalCount: dd.length
}

delegates.v1 = [
  { rate: dd[0].rank, username: dd[0].username, approval: dd[0].approval },
  { rate: dd[1].rank, username: dd[1].username, approval: dd[1].approval },
  { rate: dd[2].rank, username: dd[2].username, approval: dd[2].approval }
]

delegates.v2 = [
  { rank: dd[0].rank, username: dd[0].username, production: { approval: dd[0].approval } },
  { rank: dd[1].rank, username: dd[1].username, production: { approval: dd[1].approval } },
  { rank: dd[2].rank, username: dd[2].username, production: { approval: dd[2].approval } }
]

const transactions = {
  data: [
    { id: 1, type: 0, amount: 100000, fee: 10000000, timestamp: { epoch: 47848091, human: '2018-09-26T08:08:11.000Z' }, sender: 'address1', recipient: 'address2' },
    { id: 2, type: 0, amount: 200000, fee: 10000000, timestamp: { epoch: 47809625, human: '2018-09-25T21:27:05.000Z' }, sender: 'address2', recipient: 'address3' },
    { id: 3, type: 0, amount: 300000, fee: 10000000, timestamp: { epoch: 47796863, human: '2018-09-25T17:54:23.000Z' }, sender: 'address3', recipient: 'address3' },
    { id: 3, type: 1, amount: 0, fee: 10000000, timestamp: { epoch: 47796863, human: '2018-09-25T17:54:23.000Z' }, sender: 'address3', recipient: 'address3' }
  ]
}

const td = transactions.data

transactions.meta = {
  count: td.length
}

transactions.v1 = [
  { id: td[0].id, amount: td[0].amount, fee: td[0].fee, timestamp: td[0].timestamp.epoch, senderId: td[0].sender, recipientId: td[0].recipient },
  { id: td[1].id, amount: td[1].amount, fee: td[1].fee, timestamp: td[1].timestamp.epoch, senderId: td[1].sender, recipientId: td[1].recipient },
  { id: td[2].id, amount: td[2].amount, fee: td[2].fee, timestamp: td[2].timestamp.epoch, senderId: td[2].sender, recipientId: td[2].recipient }
]

transactions.v2 = transactions.data

const staticFeeResponses = {
  v1: {
    fees: {
      send: 10000000,
      vote: 100000000,
      secondsignature: 500000000,
      delegate: 2500000000,
      multisignature: 500000000
    },
    success: true
  },

  v2: {
    data: {
      transfer: 10000000,
      secondSignature: 500000000,
      delegateRegistration: 2500000000,
      vote: 100000000,
      multiSignature: 500000000,
      ipfs: 500000000,
      multiPayment: 100000000,
      delegateResignation: 2500000000,
      htlcLock: 100000000,
      htlcClaim: 100000000,
      htlcRefund: 100000000
    }
  }
}

export default {
  delegates,
  transactions,
  staticFeeResponses
}
