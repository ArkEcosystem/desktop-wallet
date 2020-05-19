import { shallowMount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import { MarketChartHeader } from '@/components/MarketChart';
var i18n = useI18nGlobally();
var mocks = {
    $store: {
        getters: {
            'session/currency': 'USD',
            'session/network': { token: 'ARK' },
            'session/marketChartOptions': {
                isEnabled: true,
                isExpanded: true,
                period: 'day'
            }
        }
    }
};
describe('MarketChartHeader', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = shallowMount(MarketChartHeader, {
            i18n: i18n,
            provide: {
                getPeriod: function () { return 'day'; },
                getIsExpanded: function () { return true; }
            },
            mocks: mocks
        });
    });
    it('should be instantiated', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
        expect(wrapper.contains('.MarketChartHeader__button'));
    });
    it('should emit period-change event', function () {
        var find = wrapper.find('.MarketChartHeader__button:enabled');
        find.trigger('click');
        expect(wrapper.emitted('period-change')).toBeTruthy();
    });
});
//# sourceMappingURL=MarketChartHeader.spec.js.map