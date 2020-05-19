import { merge } from 'lodash';
import { mount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import { WalletDelegates } from '@/components/Wallet';
var i18n = useI18nGlobally();
describe('WalletDelegates', function () {
    var showExplanation;
    var walletVote = {};
    var activeDelegatesMock = function (count) {
        return {
            mocks: {
                session_network: {
                    constants: {
                        activeDelegates: count
                    }
                }
            }
        };
    };
    var mountWrapper = function (config) {
        return mount(WalletDelegates, merge({
            i18n: i18n,
            provide: {
                walletVote: walletVote
            },
            mocks: {
                session_network: {
                    constants: {
                        activeDelegates: 51
                    }
                },
                $store: {
                    getters: {
                        'app/showVotingExplanation': showExplanation
                    }
                },
                $logger: {
                    error: function () { }
                },
                $error: function () { }
            },
            stubs: {
                TableWrapper: true
            }
        }, config));
    };
    it('should render', function () {
        var wrapper = mountWrapper();
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should dynamically calculate the per page options', function () {
        var wrapper = mountWrapper(activeDelegatesMock(25));
        expect(wrapper.vm.perPageOptions).toEqual([25]);
        wrapper = mountWrapper(activeDelegatesMock(53));
        expect(wrapper.vm.perPageOptions).toEqual([25, 53]);
        wrapper = mountWrapper(activeDelegatesMock(101));
        expect(wrapper.vm.perPageOptions).toEqual([25, 50, 75, 100]);
    });
    it('should cap the query limit at 100', function () {
        var wrapper = mountWrapper(activeDelegatesMock(101));
        expect(wrapper.vm.queryParams.limit).toBe(100);
    });
    describe('when the wallet is voting', function () {
        beforeEach(function () {
            walletVote = { username: 'key' };
            showExplanation = true;
        });
        it('should not display the voting explanation', function () {
            var wrapper = mountWrapper();
            expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeFalse();
        });
    });
    describe('when the wallet is not voting', function () {
        beforeEach(function () {
            walletVote = {};
        });
        describe('when the voting explanation has not been closed', function () {
            beforeEach(function () {
                showExplanation = true;
            });
            it('should display it', function () {
                var wrapper = mountWrapper();
                expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeTrue();
            });
        });
        describe('when the voting explanation has been closed', function () {
            beforeEach(function () {
                showExplanation = false;
            });
            it('should not display it', function () {
                var wrapper = mountWrapper();
                expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeFalse();
            });
        });
    });
});
//# sourceMappingURL=WalletDelegates.spec.js.map