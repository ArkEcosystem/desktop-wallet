import { clone } from 'lodash';
export default (function (store) {
    store.getters['profile/all'].forEach(function (profile) {
        if (profile.marketChartOptions === undefined) {
            var updatedProfile = clone(profile);
            updatedProfile.marketChartOptions = {
                isEnabled: profile.isMarketChartEnabled,
                isExpanded: true,
                period: 'day'
            };
            delete updatedProfile.isMarketChartEnabled;
            store.dispatch('profile/update', updatedProfile);
        }
    });
    // All successful migrations should update this property
    store.dispatch('app/setLatestAppliedMigration', '2.5.2');
});
//# sourceMappingURL=2.5.2 - add marketChartOptions to profile.js.map