import mergeTableTransactions from '@/components/utils/merge-table-transactions'

describe('Utils > mergeTableTransactions', () => {
  let transactions

  beforeEach(() => {
    transactions = [
      { id: 'tx1', timestamp: 1 },
      { id: 'tx2', timestamp: 2 },
      { id: 'tx3', timestamp: 8 },
      { id: 'tx4', timestamp: 9 },
      { id: 'tx5', timestamp: 5 },
      { id: 'tx6', timestamp: 6 }
    ]
  })

  it('should return the transactions sorted by `timestamp` descendently', () => {
    const a = [transactions[0], transactions[2]]
    const b = [transactions[1], transactions[5]]
    expect(mergeTableTransactions(a, b)).toEqual([
      transactions[2],
      transactions[5],
      transactions[1],
      transactions[0]
    ])
  })

  describe('when there are duplicates', () => {
    it('should not return duplicates', () => {
      const a = [transactions[0], transactions[2]]
      const b = [transactions[0], transactions[5]]
      expect(mergeTableTransactions(a, b)).toEqual([
        transactions[2],
        transactions[5],
        transactions[0]
      ])
    })

    it('should priorize the first `Array`', () => {
      const a = [
        {
          ...transactions[0],
          field: 'a'
        },
        transactions[2]
      ]
      const b = [
        {
          ...transactions[0],
          field: 'b'
        },
        transactions[5]
      ]
      expect(mergeTableTransactions(a, b)).toEqual([
        transactions[2],
        transactions[5],
        a[0]
      ])
    })
  })
})
