import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../../__utils__/i18n';
import TransactionConfirmBridgechainRegistration from '@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainRegistration';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmBridgechainRegistration;
    transaction = transaction || {
        asset: {
            bridgechainRegistration: {
                name: 'test bridgechain',
                genesisHash: 'genesis_hash_1234',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                },
                bridgechainRepository: 'https://github.com/arkecosystem/core.git'
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
describe('TransactionConfirmBridgechainRegistration', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have magistrates transaction group (2)', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have bridgechain registration transaction type (3)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(3);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmBridgechainRegistration')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainRegistration__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output name', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainRegistration__name .ListDividedItem__value').text()).toBe('test bridgechain');
        });
        it('should output genesis hash (truncated)', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainRegistration__genesis-hash .ListDividedItem__value').text()).toBe('genes…_1234');
        });
        it('should output seed nodes', function () {
            var seedNodes = wrapper.findAll('.TransactionConfirmBridgechainRegistration__seed-nodes .ListDividedItem__value > div');
            for (var seedNodeIndex in wrapper.vm.transaction.asset.bridgechainRegistration.seedNodes) {
                expect(seedNodes.at(seedNodeIndex).text()).toBe(wrapper.vm.transaction.asset.bridgechainRegistration.seedNodes[seedNodeIndex]);
            }
        });
        it('should output api port', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainRegistration__api-port .ListDividedItem__value').text()).toBe('4003');
        });
        it('should output bridgechain repo', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainRegistration__bridgechain-repo .ListDividedItem__value').text()).toBe('https://github.com/arkecosystem/core.git');
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
                        bridgechainRegistration: {
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
//# sourceMappingURL=TransactionConfirmBridgechainRegistration.spec.js.map