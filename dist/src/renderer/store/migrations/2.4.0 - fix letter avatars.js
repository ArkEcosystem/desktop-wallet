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
// Update the schema of profile avatars to be consistent and use `null` instead
// of `null` and `undefined` when to establish a "letter" avatar.
// It also fixes profiles that have been created, incorrectly, using `extraItems`
// from `SelectionAvatar`
export default (function (store) {
    store.getters['profile/all'].forEach(function (profile) {
        if (profile.avatar === undefined || (profile.avatar && profile.avatar.onlyLetter)) {
            store.dispatch('profile/update', __assign(__assign({}, profile), { avatar: null }));
        }
    });
    // All successful migrations should update this property
    store.dispatch('app/setLatestAppliedMigration', '2.4.0');
});
//# sourceMappingURL=2.4.0 - fix letter avatars.js.map