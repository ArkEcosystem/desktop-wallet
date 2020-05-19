import { create as createAudioSandbox } from '@/services/plugin-manager/sandbox/audio-sandbox';
global.AudioContext = {};
var api = {};
var audioSandbox = createAudioSandbox(api);
audioSandbox();
describe('Audio Sandbox', function () {
    it('should expose the AudioContext object', function () {
        expect(api.AudioContext).toBeTruthy();
    });
});
//# sourceMappingURL=audio-sandbox.spec.js.map