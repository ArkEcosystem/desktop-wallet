import store from '@/store';
describe('SessionModule', function () {
    beforeEach(function () {
        store.dispatch('session/reset');
    });
    describe('getters > marketChartOptions', function () {
        it('should get the market chart options', function () {
            expect(store.getters['session/marketChartOptions']).toEqual({ isEnabled: true, isExpanded: true, period: 'day' });
        });
    });
    describe('getters > walletSortParams', function () {
        it('should get the wallet sort params', function () {
            expect(store.getters['session/walletSortParams']).toEqual({ field: 'balance', type: 'desc' });
        });
    });
    describe('getters > contactSortParams', function () {
        it('should get the contact sort params', function () {
            expect(store.getters['session/contactSortParams']).toEqual({ field: 'name', type: 'asc' });
        });
    });
    describe('getters > contactSortParams', function () {
        it('should get value of hideWalletButtonText', function () {
            expect(store.getters['session/hideWalletButtonText']).toEqual(false);
        });
    });
    it('actions > should reset session', function () {
        expect(store.getters['session/theme']).toEqual('light');
        store.dispatch('session/setTheme', 'dark');
        expect(store.getters['session/theme']).toEqual('dark');
        store.dispatch('session/reset');
        expect(store.getters['session/theme']).toEqual('light');
    });
    describe('actions > setMarketChartOptions', function () {
        it('should set the market chart options', function () {
            var params = { foo: 'bar' };
            store.dispatch('session/setMarketChartOptions', params);
            expect(store.getters['session/marketChartOptions']).toEqual({ foo: 'bar' });
        });
    });
    describe('actions > setWalletSortParams', function () {
        it('should set the wallet sort params', function () {
            var params = { foo: 'bar' };
            store.dispatch('session/setWalletSortParams', params);
            expect(store.getters['session/walletSortParams']).toEqual({ foo: 'bar' });
        });
    });
    describe('actions > setContactSortParams', function () {
        it('should set the contact sort params', function () {
            var params = { foo: 'bar' };
            store.dispatch('session/setContactSortParams', params);
            expect(store.getters['session/contactSortParams']).toEqual({ foo: 'bar' });
        });
    });
    describe('actions > setHideWalletButtonText', function () {
        it('should set the value for hideWalletButtonText', function () {
            store.dispatch('session/setHideWalletButtonText', true);
            expect(store.getters['session/hideWalletButtonText']).toEqual(true);
        });
    });
    describe('actions > setIsAdvancedModeEnabled', function () {
        it('should set the value for isAdvancedModeEnabled', function () {
            store.dispatch('session/setIsAdvancedModeEnabled', true);
            expect(store.getters['session/isAdvancedModeEnabled']).toEqual(true);
        });
    });
    describe('actions > setPriceApi', function () {
        it('should set the value for priceApi', function () {
            store.dispatch('session/setPriceApi', 'coingecko');
            expect(store.getters['session/priceApi']).toEqual('coingecko');
        });
    });
    describe('actions > setLastFeeByType', function () {
        it('should set the value for the last fee by type', function () {
            store.dispatch('session/setLastFeeByType', {
                fee: '1000',
                type: 0,
                typeGroup: 1
            });
            expect(store.getters['session/lastFees']).toEqual({
                1: {
                    0: '1000'
                }
            });
        });
    });
    describe('actions > setDefaultChosenFee', function () {
        it('should set the value for defaultChosenFee', function () {
            store.dispatch('session/setDefaultChosenFee', 'LAST');
            expect(store.getters['session/defaultChosenFee']).toEqual('LAST');
        });
    });
});
//# sourceMappingURL=session.spec.js.map