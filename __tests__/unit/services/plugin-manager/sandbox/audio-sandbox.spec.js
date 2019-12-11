import { create as createAudioSandbox } from '@/services/plugin-manager/sandbox/audio-sandbox'

global.AudioContext = {}

const api = {}
const audioSandbox = createAudioSandbox(api)
audioSandbox()

describe('Audio Sandbox', () => {
  it('should expose the AudioContext object', () => {
    expect(api.AudioContext).toBeTruthy()
  })
})
