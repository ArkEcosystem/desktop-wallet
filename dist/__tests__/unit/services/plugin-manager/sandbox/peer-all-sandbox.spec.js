import { create as createPeerAllSandbox } from '@/services/plugin-manager/sandbox/peer-all-sandbox';
var PeerDiscoveryStub = /** @class */ (function () {
    function PeerDiscoveryStub() {
    }
    PeerDiscoveryStub.prototype.withLatency = function () {
        return this;
    };
    PeerDiscoveryStub.prototype.sortBy = function () {
        return this;
    };
    return PeerDiscoveryStub;
}());
var mockDispatch = jest.fn(function () { return new PeerDiscoveryStub(); });
var walletApi;
var app;
var peerAllSandbox;
describe('Peer All Sandbox', function () {
    beforeEach(function () {
        walletApi = {};
        app = {
            $store: {
                dispatch: mockDispatch
            }
        };
        peerAllSandbox = createPeerAllSandbox(walletApi, app);
        peerAllSandbox();
    });
    it('should expose functions', function () {
        expect(mockDispatch).toHaveBeenCalled();
        expect(walletApi.peers.all).toBeTruthy();
    });
});
//# sourceMappingURL=peer-all-sandbox.spec.js.map