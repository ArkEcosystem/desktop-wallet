import { orderBy, uniqBy } from 'lodash'
import BigNumber from 'bignumber.js'

/**
 * This utility is used to merge the transactions that have been fetched using
 * the `Client` service and those which has been stored when sending them
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Object} order - of transactions to return
 * @return {Array}
 */
export default (a, b, order = null) => {
  const { field, type } = order || { field: 'timestamp', type: 'desc' }

  // The order is important: the fetched transactions should override the stored
  const transactions = uniqBy([
    ...a,
    ...b
  ], 'id')

  if (['amount', 'fee'].includes(field)) {
    return transactions.sort((a, b) => {
      const bignumA = new BigNumber(a[field])
      const bignumB = new BigNumber(b[field])

      return type === 'asc' ? bignumA.comparedTo(bignumB) : bignumB.comparedTo(bignumA)
    })
  }

  return orderBy(transactions, field, type)
}
