import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ModalAdditionalLedgers } from '@/components/Modal';
Vue.use(Vuelidate);
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(ModalAdditionalLedgers, {
        i18n: i18n,
        mocks: {
            $store: {
                getters: {
                    'ledger/wallets': function () {
                        return [];
                    }
                }
            }
        }
    });
});
describe('ModalAdditionalLedgers', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=ModalAdditionalLedgers.spec.js.map