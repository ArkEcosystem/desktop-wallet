import { uniqBy } from 'lodash'

/**
 * This utility is used to merge the transactions that have been fetched using
 * the `Client` service and those which has been stored when sending them
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Number} number - of transactions to return
 * @return {Array}
 */
export default (a, b, number) => {
  // The order is important: the fetched transactions should override the stored
  return uniqBy([
    ...a,
    ...b
  ], 'id')
}
