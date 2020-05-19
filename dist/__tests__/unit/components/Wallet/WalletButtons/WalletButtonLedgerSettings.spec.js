import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { WalletButtonLedgerSettings } from '@/components/Wallet/WalletButtons';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(WalletButtonLedgerSettings, {
        i18n: i18n,
        mocks: {
            $store: {
                getters: {
                    'ledger/isConnected': function () {
                        return true;
                    }
                }
            }
        }
    });
});
describe('WalletButtonLedgerSettings', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=WalletButtonLedgerSettings.spec.js.map