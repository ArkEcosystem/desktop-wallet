import logger from 'electron-log';
import semver from 'semver';
var VuexMigrations = /** @class */ (function () {
    /**
     * @param {(String|Function)} fromVersion - From this migration version (included)
     * @param {(String|Function)} untilVersion - Until this migration version (included)
     */
    function VuexMigrations(_a) {
        var fromVersion = _a.fromVersion, untilVersion = _a.untilVersion;
        this.fromVersion = fromVersion;
        this.untilVersion = untilVersion;
    }
    Object.defineProperty(VuexMigrations.prototype, "migrationsContext", {
        /**
         * Webpack does not admit using a variable to indicate the path of the directory
         * @see https://webpack.js.org/guides/dependency-management/#require-context
         */
        get: function () {
            return require.context('../migrations', true, /\.js$/);
        },
        enumerable: false,
        configurable: true
    });
    VuexMigrations.prototype.checkVersion = function (version) {
        if (!semver.valid(version)) {
            throw new Error("The version \"" + version + "\" does not comply with semver");
        }
        var from = typeof this.fromVersion === 'function' ? this.fromVersion(this.store) : this.fromVersion;
        var until = typeof this.untilVersion === 'function' ? this.untilVersion(this.store) : this.untilVersion;
        return semver.gt(version, from) && semver.lte(version, until);
    };
    VuexMigrations.prototype.collect = function () {
        var _this = this;
        this.migrations = [];
        this.migrationsContext.keys().sort().forEach(function (key) {
            var _a = key.match(/\.\/(.*) - (.*)\.js/), filename = _a[0], version = _a[1], title = _a[2];
            if (_this.checkVersion(version)) {
                var handler = _this.migrationsContext(filename).default;
                _this.migrations.push({ version: version, title: title, handler: handler });
            }
        });
    };
    VuexMigrations.prototype.apply = function () {
        var _this = this;
        this.migrations.forEach(function (migration) {
            if (process.env.NODE_ENV !== 'test') {
                logger.info("Applying migration " + migration.version + ": " + migration.title);
            }
            migration.handler(_this.store);
        });
    };
    Object.defineProperty(VuexMigrations.prototype, "plugin", {
        /**
         * Integrates with `vuex-persist` and `vuex-persist-ready`
         */
        get: function () {
            var _this = this;
            return function (store) {
                _this.store = store;
                _this.store._vm.$root.$on('vuex-persist:ready', function () {
                    _this.collect();
                    _this.apply();
                });
            };
        },
        enumerable: false,
        configurable: true
    });
    return VuexMigrations;
}());
export default VuexMigrations;
//# sourceMappingURL=vuex-persist-migrations.js.map