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
export default (function (store) {
    store.getters['profile/all'].forEach(function (profile) {
        var invalidFields = ['id', 'name', 'description', 'permissions', 'isEnabled'];
        if (profile.pluginSortParams && invalidFields.includes(profile.pluginSortParams.field)) {
            store.dispatch('profile/update', __assign(__assign({}, profile), { pluginSortParams: {
                    field: 'title',
                    type: profile.pluginSortParams.type
                } }));
        }
    });
    store.dispatch('app/setLatestAppliedMigration', '2.7.0');
});
//# sourceMappingURL=2.7.0 - fix plugin sort params.js.map