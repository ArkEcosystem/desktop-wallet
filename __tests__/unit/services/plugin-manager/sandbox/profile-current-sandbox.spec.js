import { create as createProfileCurrentSandbox } from '@/services/plugin-manager/sandbox/profile-current-sandbox'

const mockGetter = jest.fn(() => ({
  id: 1
}))

let walletApi
let app
let profileCurrentSandbox

describe('Profile Current Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    app = {
      $store: {
        getters: {
          'profile/public': mockGetter
        }
      }
    }
    profileCurrentSandbox = createProfileCurrentSandbox(walletApi, app)
    profileCurrentSandbox()
  })

  it('should expose functions', () => {
    expect(walletApi.profiles).toBeTruthy()
    expect(walletApi.profiles.getCurrent).toBeTruthy()
  })
})
