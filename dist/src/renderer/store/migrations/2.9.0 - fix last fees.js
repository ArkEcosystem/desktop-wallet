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
import { clone } from 'lodash';
import { TRANSACTION_GROUPS } from '@config';
export default (function (store) {
    store.getters['profile/all'].forEach(function (profile) {
        var _a;
        var lastFees = profile.lastFees;
        var values = Object.values(lastFees || {});
        if (!values.length || values.every(function (value) { return typeof value === 'object'; })) {
            return;
        }
        var updatedProfile = clone(profile);
        updatedProfile.lastFees = (_a = {},
            _a[TRANSACTION_GROUPS.STANDARD] = __assign({}, lastFees),
            _a);
        store.dispatch('profile/update', updatedProfile);
    });
    store.dispatch('app/setLatestAppliedMigration', '2.9.0');
});
//# sourceMappingURL=2.9.0 - fix last fees.js.map