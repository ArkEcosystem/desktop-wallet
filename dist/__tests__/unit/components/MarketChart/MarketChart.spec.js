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
import { MarketChart } from '@/components/MarketChart';
var mocks = {
    session_network: {
        market: {
            ticker: 'ARK'
        }
    },
    session_profile: {
        timeFormat: 'Default'
    },
    $store: {
        getters: {
            'session/currency': 'USD'
        }
    }
};
var propsData = {
    period: 'day',
    isExpanded: false
};
describe('MarketChart', function () {
    it('should be instantiated', function () {
        var wrapper = shallowMount(MarketChart, {
            mocks: mocks,
            propsData: propsData
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should render the chart when isExpanded changes (from false to true)', function () {
        var wrapper = shallowMount(MarketChart, {
            mocks: mocks,
            propsData: propsData
        });
        jest.spyOn(wrapper.vm, 'renderChart');
        wrapper.setProps({ isExpanded: true });
        expect(wrapper.vm.renderChart).toHaveBeenCalled();
    });
    it('should not render the chart when isExpanded changes (from true to false)', function () {
        var wrapper = shallowMount(MarketChart, {
            mocks: mocks,
            propsData: __assign(__assign({}, propsData), { isExpanded: true })
        });
        jest.spyOn(wrapper.vm, 'renderChart');
        wrapper.setProps({ isExpanded: false });
        expect(wrapper.vm.renderChart).not.toHaveBeenCalled();
    });
    describe('formatHour', function () {
        it('should use the session to return 12h or 24h format', function () {
            var wrapper = shallowMount(MarketChart, {
                mocks: mocks,
                propsData: propsData
            });
            expect(wrapper.vm.formatHour('11:00')).toEqual('11:00');
            expect(wrapper.vm.formatHour('18:00')).toEqual('18:00');
            mocks.session_profile.timeFormat = '12h';
            wrapper = shallowMount(MarketChart, {
                mocks: mocks,
                propsData: propsData
            });
            expect(wrapper.vm.formatHour('00:10')).toEqual('12:10 PM');
            expect(wrapper.vm.formatHour('03:00')).toEqual('3:00 AM');
            expect(wrapper.vm.formatHour('11:09')).toEqual('11:09 AM');
            expect(wrapper.vm.formatHour('18:00')).toEqual('6:00 PM');
            expect(wrapper.vm.formatHour('24:05')).toEqual('12:05 PM');
            mocks.session_profile.timeFormat = '24h';
            wrapper = shallowMount(MarketChart, {
                mocks: mocks,
                propsData: propsData
            });
            expect(wrapper.vm.formatHour('11:00')).toEqual('11:00');
            expect(wrapper.vm.formatHour('18:00')).toEqual('18:00');
        });
    });
});
//# sourceMappingURL=MarketChart.spec.js.map