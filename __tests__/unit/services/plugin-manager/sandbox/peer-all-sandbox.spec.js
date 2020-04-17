import { create as createPeerAllSandbox } from '@/services/plugin-manager/sandbox/peer-all-sandbox'

class PeerDiscoveryStub {
  withLatency () {
    return this
  }

  sortBy () {
    return this
  }
}

const mockGetter = jest.fn(() => new PeerDiscoveryStub())

let walletApi
let app
let peerAllSandbox

describe('Peer All Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    app = {
      $store: {
        getters: {
          'peer/discovery/get': mockGetter
        }
      }
    }
    peerAllSandbox = createPeerAllSandbox(walletApi, app)
    peerAllSandbox()
  })

  it('should expose functions', () => {
    expect(mockGetter).toHaveBeenCalled()
    expect(walletApi.peers.all).toBeTruthy()
  })
})
