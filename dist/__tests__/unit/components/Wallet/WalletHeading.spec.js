import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import { useI18n } from '../../__utils__/i18n';
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading';
import WalletHeadingActions from '@/components/Wallet/WalletHeading/WalletHeadingActions';
import WalletHeadingPrimaryActions from '@/components/Wallet/WalletHeading/WalletHeadingPrimaryActions';
import WalletHeadingSecondaryActions from '@/components/Wallet/WalletHeading/WalletHeadingSecondaryActions';
var localVue = createLocalVue();
localVue.use(Vuex);
var i18n = useI18n(localVue);
var WalletHeadingInfoStub = {
    render: function () { },
    methods: {
        refreshWallet: function () { }
    }
};
var store = new Vuex.Store({
    modules: {
        wallet: {
            namespaced: true,
            getters: {
                secondaryButtonsVisible: function () { return false; }
            },
            actions: {
                setSecondaryButtonsVisible: function () { }
            }
        }
    }
});
var sampleWalletData = {
    address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
    balance: 797.8921
};
var mocks = {
    $store: {
        getters: {
            'session/network': {
                milestone: {
                    aip11: false
                }
            }
        }
    },
    wallet_fromRoute: sampleWalletData,
    wallet_truncate: function (value) { return value; },
    walletVote: {
        publicKey: null
    }
};
var stubs = {
    WalletHeadingInfo: WalletHeadingInfoStub
};
describe('WalletHeading', function () {
    it('should be instatiated', function () {
        var wrapper = shallowMount(WalletHeading, {
            store: store,
            localVue: localVue,
            i18n: i18n,
            mocks: mocks,
            stubs: stubs
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
describe('WalletHeadingActions', function () {
    it('should be instatiated', function () {
        var wrapper = shallowMount(WalletHeadingActions, {
            store: store,
            localVue: localVue,
            i18n: i18n,
            mocks: mocks,
            stubs: stubs
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
describe('WalletHeadingPrimaryActions', function () {
    it('should be instatiated', function () {
        var wrapper = shallowMount(WalletHeadingPrimaryActions, {
            i18n: i18n,
            provide: {
                walletVote: {},
                switchToTab: jest.fn()
            },
            mocks: mocks,
            stubs: stubs
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
describe('WalletHeadingSecondaryActions', function () {
    it('should be instatiated', function () {
        var wrapper = shallowMount(WalletHeadingSecondaryActions, {
            i18n: i18n,
            mocks: mocks,
            stubs: stubs
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=WalletHeading.spec.js.map