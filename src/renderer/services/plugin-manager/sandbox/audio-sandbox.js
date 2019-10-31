export function createAudioSandbox (sandbox) {
  return () => {
    sandbox.AudioContext = AudioContext
  }
}
