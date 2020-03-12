import { create as createPeerAllSandbox } from '@/services/plugin-manager/sandbox/peer-all-sandbox'

class PeerDiscoveryStub {
  withLatency () {
    return this
  }

  sortBy () {
    return this
  }
}

const mockDispatch = jest.fn(action => {
  if (action === 'peer/getPeerDiscovery') {
    return new PeerDiscoveryStub()
  } else if (action === 'peer/connectToBest') {
    return { ip: '1.1.1.1' }
  }
})

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
    expect(walletApi.peers.connectToBest).toBeTruthy()
  })
})
