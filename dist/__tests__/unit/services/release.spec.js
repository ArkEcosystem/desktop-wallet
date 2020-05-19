import releaseService from '@/services/release';
import packageJson from '@package.json';
var releaseUrl = 'https://github.com/ArkEcosystem/desktop-wallet/releases/latest';
describe('Services > Release', function () {
    describe('currentVersion', function () {
        it('should return the current version', function () {
            expect(releaseService.currentVersion).toEqual(packageJson.version);
        });
    });
    describe('latestReleaseUrl', function () {
        it('should return the URL of the latest release endpoint', function () {
            expect(releaseService.latestReleaseUrl).toEqual(releaseUrl);
        });
    });
});
//# sourceMappingURL=release.spec.js.map