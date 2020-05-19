import { mount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import ContactNew from '@/pages/Contact/ContactNew';
var i18n = useI18nGlobally();
describe('pages > ContactNew', function () {
    var mountPage = function () {
        return mount(ContactNew, {
            i18n: i18n,
            mocks: {
                schema: {
                    address: '',
                    name: ''
                },
                session_network: {
                    version: 30
                },
                $store: {},
                $v: {
                    model: {},
                    schema: {
                        address: {},
                        name: {}
                    }
                },
                wallet_name: function (value) { return value; }
            }
        });
    };
    it('should have the right name', function () {
        var wrapper = mountPage();
        expect(wrapper.name()).toEqual('ContactNew');
    });
    it('should render component', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.ContactNew')).toBeTruthy();
    });
});
//# sourceMappingURL=ContactNew.spec.js.map