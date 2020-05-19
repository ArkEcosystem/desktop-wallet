var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { orderBy, uniqBy } from 'lodash';
import BigNumber from 'bignumber.js';
/**
 * This utility is used to merge the transactions that have been fetched using
 * the `Client` service and those which has been stored when sending them
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Object} order - of transactions to return
 * @return {Array}
 */
export default (function (a, b, order) {
    if (order === void 0) { order = null; }
    var _a = order || { field: 'timestamp', type: 'desc' }, field = _a.field, type = _a.type;
    // The order is important: the fetched transactions should override the stored
    var transactions = uniqBy(__spreadArrays(a, b), 'id');
    if (['amount', 'fee'].includes(field)) {
        return transactions.sort(function (a, b) {
            var bignumA = new BigNumber(a[field]);
            var bignumB = new BigNumber(b[field]);
            return type === 'asc' ? bignumA.comparedTo(bignumB) : bignumB.comparedTo(bignumA);
        });
    }
    return orderBy(transactions, field, type);
});
//# sourceMappingURL=merge-table-transactions.js.map