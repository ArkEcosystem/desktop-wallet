import { createEventsSandbox } from '@/services/plugin-manager/sandbox/events-sandbox'

const walletApi = {}
const app = {
  $eventBus: jest.fn()
}
const eventsSandbox = createEventsSandbox(walletApi, app)
eventsSandbox()

describe('Events Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.eventBus).toBeTruthy()
  })
})
