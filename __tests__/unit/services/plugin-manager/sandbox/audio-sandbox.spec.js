import { createAudioSandbox } from '@/services/plugin-manager/sandbox/audio-sandbox'

global.AudioContext = {}

const api = {}
const sandbox = createAudioSandbox(api)
sandbox()

describe('Audio Sandbox', () => {
  it('should expose the AudioContext object', () => {
    expect(api.AudioContext).toBeTruthy()
  })
})
