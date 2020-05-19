// NOTE: uses a relative path because it is used on the `main` process too
import packageJson from '../../../package.json';
export default {
    get currentVersion() {
        return packageJson.version;
    },
    get latestReleaseUrl() {
        // eslint-disable-next-line no-unused-vars
        var _a = packageJson.repository.url.match(/github.com\/(.*)\.git$/), project = _a[1];
        return "https://github.com/" + project + "/releases/latest";
    }
};
//# sourceMappingURL=release.js.map