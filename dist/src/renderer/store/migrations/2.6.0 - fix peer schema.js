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
// Update the schema of peers to v2
export default (function (store) {
    for (var _i = 0, _a = Object.keys(store.state.peer.all); _i < _a.length; _i++) {
        var networkId = _a[_i];
        var peerData = store.state.peer.all[networkId];
        var peers = peerData.peers;
        if (!peers.length) {
            continue;
        }
        peers = peers.map(function (peer) {
            if (peer.latency) {
                return __assign({}, peer);
            }
            return __assign(__assign({}, peer), { latency: peer.delay || 0 });
        });
        store.commit('peer/SET_PEERS', { peers: peers, networkId: networkId });
    }
    // All successful migrations should update this property
    store.dispatch('app/setLatestAppliedMigration', '2.6.0');
});
//# sourceMappingURL=2.6.0 - fix peer schema.js.map