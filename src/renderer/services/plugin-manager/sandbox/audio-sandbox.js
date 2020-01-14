export function create (sandbox) {
  return () => {
    sandbox.AudioContext = AudioContext
  }
}
