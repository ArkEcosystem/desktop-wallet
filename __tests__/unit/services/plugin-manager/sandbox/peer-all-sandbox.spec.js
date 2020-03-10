import { create as createPeerAllSandbox } from '@/services/plugin-manager/sandbox/peer-all-sandbox'

class PeerDiscoveryStub {
  withLatency () {
    return this
  }

  sortBy () {
    return this
  }
}

const mockDispatch = jest.fn(() => new PeerDiscoveryStub())

let walletApi
let app
let peerAllSandbox

describe('Peer All Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    app = {
      $store: {
        dispatch: mockDispatch
      }
    }
    peerAllSandbox = createPeerAllSandbox(walletApi, app)
    peerAllSandbox()
  })

  it('should expose functions', () => {
    expect(mockDispatch).toHaveBeenCalled()
    expect(walletApi.peers.all).toBeTruthy()
  })
})
