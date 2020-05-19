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
import { shallowMount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import transaction from '../../__fixtures__/models/transaction';
import TransactionModal from '@/components/Transaction/TransactionModal';
var i18n = useI18nGlobally();
describe('TransactionModal', function () {
    var profileId = 'exampleId';
    var wrapper;
    var $store;
    beforeEach(function () {
        $store = { dispatch: jest.fn() };
        wrapper = shallowMount(TransactionModal, {
            i18n: i18n,
            propsData: {
                type: 0
            },
            mocks: {
                session_profile: { id: profileId },
                session_network: {
                    version: 12,
                    constants: {
                        epoch: '2017-03-21T13:00:00.000Z'
                    }
                },
                $logger: {
                    error: jest.fn()
                },
                $store: $store
            },
            stubs: {
                PortalTarget: true
            }
        });
    });
    it('should be instantiated', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('isSuccessfulResponse', function () {
        // Only V2
        var response = {
            body: { data: {} }
        };
        describe('when the response status is not 200', function () {
            beforeEach(function () {
                response.status = 500;
            });
            it('should return `false`', function () {
                expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse();
            });
        });
        describe('when the response status is 200', function () {
            beforeEach(function () {
                response.status = 200;
            });
            describe('when the response does not include errors', function () {
                beforeEach(function () {
                    response.body.errors = null;
                    response.body.data = {
                        invalid: [],
                        accept: []
                    };
                });
                it('should return `true`', function () {
                    expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue();
                });
            });
            describe('when the response includes errors', function () {
                beforeEach(function () {
                    response.body.errors = {
                        tx1: [{ type: 'ERR_LOW_FEE' }]
                    };
                    response.body.data = {
                        invalid: [],
                        accept: []
                    };
                });
                it('should return `false`', function () {
                    expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse();
                });
            });
            describe('when the response does not include invalid transactions', function () {
                beforeEach(function () {
                    response.body.errors = null;
                    response.body.data.invalid = [];
                });
                it('should return `true`', function () {
                    expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue();
                });
            });
            describe('when the response includes invalid transactions', function () {
                beforeEach(function () {
                    response.body.data = {
                        invalid: ['tx1']
                    };
                });
                it('should return `false`', function () {
                    expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse();
                });
            });
        });
    });
    describe('storeTransaction', function () {
        var expectTransactionStored = function (transaction, timestamp) {
            var id = transaction.id, type = transaction.type, typeGroup = transaction.typeGroup, amount = transaction.amount, fee = transaction.fee, vendorField = transaction.vendorField;
            var expected = {
                profileId: profileId,
                id: id,
                type: type,
                typeGroup: typeGroup,
                amount: amount,
                fee: fee,
                vendorField: vendorField,
                confirmations: 0,
                timestamp: timestamp,
                sender: "address of " + transaction.senderPublicKey,
                recipient: transaction.recipientId,
                raw: transaction
            };
            expect($store.dispatch).toHaveBeenCalledWith('transaction/create', expected);
        };
        describe('when the transaction has a timestamp (V1)', function () {
            it('should calculate the timestamp based on the epoch', function () {
                var dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1000000);
                var timestamp = (new Date(wrapper.vm.session_network.constants.epoch)).getTime() + transaction.timestamp * 1000;
                wrapper.vm.storeTransaction(transaction);
                expectTransactionStored(transaction, timestamp);
                dateSpy.mockRestore();
            });
        });
        describe('when the transaction has no timestamp (V2)', function () {
            it('should set the timestamp to the current time', function () {
                var dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1000000);
                var v2Transaction = __assign(__assign({}, transaction), { version: 2, expiration: 0 });
                delete v2Transaction.timestamp;
                wrapper.vm.storeTransaction(v2Transaction);
                expectTransactionStored(v2Transaction, Date.now());
                dateSpy.mockRestore();
            });
        });
    });
});
//# sourceMappingURL=TransactionModal.spec.js.map