import { create as createPeerCurrentSandbox } from '@/services/plugin-manager/sandbox/peer-current-sandbox'

const walletApi = {}
const app = {}
const peerCurrentSandbox = createPeerCurrentSandbox(walletApi, app)
peerCurrentSandbox()

describe('Peer Current Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.peers).toBeTruthy()
    expect(walletApi.peers.current).toBeTruthy()
    expect(walletApi.peers.current.get).toBeTruthy()
    expect(walletApi.peers.current.post).toBeTruthy()
  })
})
