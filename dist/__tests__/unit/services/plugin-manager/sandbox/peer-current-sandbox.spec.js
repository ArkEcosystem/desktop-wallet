import { create as createPeerCurrentSandbox } from '@/services/plugin-manager/sandbox/peer-current-sandbox';
var mockGetter = jest.fn(function () { return ({
    ip: '1.1.1.1'
}); });
var walletApi;
var app;
var peerCurrentSandbox;
describe('Peer Current Sandbox', function () {
    beforeEach(function () {
        walletApi = {};
        app = {
            $store: {
                getters: {
                    'peer/current': mockGetter
                }
            }
        };
        peerCurrentSandbox = createPeerCurrentSandbox(walletApi, app);
        peerCurrentSandbox();
    });
    it('should expose functions', function () {
        expect(walletApi.peers).toBeTruthy();
        expect(walletApi.peers.current).toBeTruthy();
        expect(walletApi.peers.current.get).toBeTruthy();
        expect(walletApi.peers.current.post).toBeTruthy();
        expect(walletApi.peers.getCurrent).toBeTruthy();
    });
});
//# sourceMappingURL=peer-current-sandbox.spec.js.map