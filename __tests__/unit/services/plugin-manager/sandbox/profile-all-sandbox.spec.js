import { createProfileAllSandbox } from '@/services/plugin-manager/sandbox/profile-all-sandbox'

const mockGetter = jest.fn()

let walletApi
let app
let profileAllSandbox

describe('Profile All Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    app = {
      $store: {
        getters: {
          'profile/public': mockGetter
        }
      }
    }
    profileAllSandbox = createProfileAllSandbox(walletApi, app)
    profileAllSandbox()
  })

  it('should expose functions', () => {
    expect(mockGetter).toHaveBeenCalled()
    expect(walletApi.profiles.all).toBeTruthy()
  })
})
