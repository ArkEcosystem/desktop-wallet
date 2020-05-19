import { create as createHttpSandbox } from '@/services/plugin-manager/sandbox/http-sandbox';
import got from 'got';
jest.mock('got');
var plugin = {
    config: {
        urls: ['ark.io']
    }
};
var walletApi;
var httpSandbox;
describe('Http Sandbox', function () {
    beforeEach(function () {
        walletApi = {};
        httpSandbox = createHttpSandbox(walletApi, plugin);
        httpSandbox();
    });
    it('should expose functions', function () {
        expect(walletApi.http).toBeTruthy();
    });
    it('should fail when requesting an unauthorized url', function () {
        expect(function () { return walletApi.http.get('google.com'); })
            .toThrow('URL "google.com" not allowed');
    });
    it('should get an authrorized url', function () {
        walletApi.http.get('ark.io');
        expect(got.get).toHaveBeenCalledWith('ark.io', undefined);
    });
    it('should get an authrorized url with options', function () {
        var options = { agent: 'jest' };
        walletApi.http.get('ark.io', options);
        expect(got.get).toHaveBeenCalledWith('ark.io', options);
    });
    it('should post to an authrorized url', function () {
        walletApi.http.post('ark.io');
        expect(got.post).toHaveBeenCalledWith('ark.io', undefined);
    });
    it('should post to an authrorized url with options', function () {
        var options = { version: 2 };
        walletApi.http.post('ark.io', options);
        expect(got.post).toHaveBeenCalledWith('ark.io', options);
    });
});
//# sourceMappingURL=http-sandbox.spec.js.map