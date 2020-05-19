var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import mergeTableTransactions from '@/components/utils/merge-table-transactions';
describe('Utils > mergeTableTransactions', function () {
    var transactions;
    beforeEach(function () {
        transactions = [
            { id: 'tx1', timestamp: 1, amount: '6' },
            { id: 'tx2', timestamp: 2, amount: '5' },
            { id: 'tx3', timestamp: 8, amount: '9' },
            { id: 'tx4', timestamp: 9, amount: '8' },
            { id: 'tx5', timestamp: 5, amount: '2' },
            { id: 'tx6', timestamp: 6, amount: '1' }
        ];
    });
    it('should return the transactions sorted by `timestamp` descendently', function () {
        var a = [
            transactions[0],
            transactions[2]
        ];
        var b = [
            transactions[1],
            transactions[5]
        ];
        expect(mergeTableTransactions(a, b)).toEqual([
            transactions[2],
            transactions[5],
            transactions[1],
            transactions[0]
        ]);
    });
    it('should return the transactions sorted by `timestamp` ascendently', function () {
        var a = [
            transactions[0],
            transactions[2]
        ];
        var b = [
            transactions[1],
            transactions[5]
        ];
        expect(mergeTableTransactions(a, b, { field: 'timestamp', type: 'asc' })).toEqual([
            transactions[0],
            transactions[1],
            transactions[5],
            transactions[2]
        ]);
    });
    it('should return the transactions sorted by `amount` ascendently', function () {
        var a = [
            transactions[0],
            transactions[2]
        ];
        var b = [
            transactions[1],
            transactions[5]
        ];
        expect(mergeTableTransactions(a, b, { field: 'amount', type: 'asc' })).toEqual([
            transactions[5],
            transactions[1],
            transactions[0],
            transactions[2]
        ]);
    });
    describe('when there are duplicates', function () {
        it('should not return duplicates', function () {
            var a = [
                transactions[0],
                transactions[2]
            ];
            var b = [
                transactions[0],
                transactions[5]
            ];
            expect(mergeTableTransactions(a, b)).toEqual([
                transactions[2],
                transactions[5],
                transactions[0]
            ]);
        });
        it('should priorize the first `Array`', function () {
            var a = [
                __assign(__assign({}, transactions[0]), { field: 'a' }),
                transactions[2]
            ];
            var b = [
                __assign(__assign({}, transactions[0]), { field: 'b' }),
                transactions[5]
            ];
            expect(mergeTableTransactions(a, b)).toEqual([
                transactions[2],
                transactions[5],
                a[0]
            ]);
        });
    });
});
//# sourceMappingURL=merge-table-transactions.spec.js.map