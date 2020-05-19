import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../../__utils__/i18n';
import TransactionConfirmBridgechainUpdate from '@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainUpdate';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmBridgechainUpdate;
    transaction = transaction || {
        asset: {
            bridgechainUpdate: {
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                }
            }
        }
    };
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        provide: {
            currentWallet: {
                address: 'address-1'
            },
            transaction: transaction
        },
        mocks: {
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; })
        }
    });
};
describe('TransactionConfirmBridgechainUpdate', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have magistrates transaction group (2)', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have bridgechain update transaction type (5)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(5);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmBridgechainUpdate')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainUpdate__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output seed nodes', function () {
            var seedNodes = wrapper.findAll('.TransactionConfirmBridgechainUpdate__seed-nodes .ListDividedItem__value > div');
            for (var seedNodeIndex in wrapper.vm.transaction.asset.bridgechainUpdate.seedNodes) {
                expect(seedNodes.at(seedNodeIndex).text()).toBe(wrapper.vm.transaction.asset.bridgechainUpdate.seedNodes[seedNodeIndex]);
            }
        });
        it('should output api port', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainUpdate__api-port .ListDividedItem__value').text()).toBe('4003');
        });
    });
    describe('computed', function () {
        describe('senderLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.senderLabel).toBe('formatted-address-1');
            });
        });
        describe('apiPort', function () {
            it('should return core-api port if provided', function () {
                expect(wrapper.vm.apiPort).toBe(4003);
            });
            it('should return null if no core-api port', function () {
                createWrapper(null, {
                    asset: {
                        bridgechainUpdate: {
                            name: 'test',
                            genesisHash: '1234',
                            seedNodes: [
                                '1.1.1.1',
                                '2.2.2.2'
                            ],
                            ports: {},
                            bridgechainRepository: 'https://github.com/arkecosystem/core.git'
                        }
                    }
                });
                expect(wrapper.vm.apiPort).toBe(null);
            });
        });
    });
});
//# sourceMappingURL=TransactionConfirmBridgechainUpdate.spec.js.map