import { create as createPeerCurrentSandbox } from '@/services/plugin-manager/sandbox/peer-current-sandbox'

const mockGetter = jest.fn(() => ({
  ip: '1.1.1.1'
}))

let walletApi
let app
let peerCurrentSandbox

describe('Peer Current Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    app = {
      $store: {
        getters: {
          'peer/current': mockGetter
        }
      }
    }
    peerCurrentSandbox = createPeerCurrentSandbox(walletApi, app)
    peerCurrentSandbox()
  })

  it('should expose functions', () => {
    expect(walletApi.peers).toBeTruthy()
    expect(walletApi.peers.current).toBeTruthy()
    expect(walletApi.peers.current.get).toBeTruthy()
    expect(walletApi.peers.current.post).toBeTruthy()
    expect(walletApi.peers.getCurrent).toBeTruthy()
  })
})
