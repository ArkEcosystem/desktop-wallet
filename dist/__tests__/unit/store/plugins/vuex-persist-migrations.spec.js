import MigrationsPlugin from '@/store/plugins/vuex-persist-migrations';
describe('Migrations plugin', function () {
    var plugin;
    var fromVersion = '1.0.0';
    var untilVersion = '2.0.2';
    beforeAll(function () {
        plugin = new MigrationsPlugin({ fromVersion: fromVersion, untilVersion: untilVersion });
        plugin.migrations = [];
    });
    describe('checkVersion', function () {
        describe('when the version does not follow semver rules', function () {
            it('should throw an Error', function () {
                expect(function () { return plugin.checkVersion('no'); }).toThrow(/semver/);
            });
        });
        describe('when the version is between the `fromVersion` (not included) and `untilVersion` (included)', function () {
            it('should return `true`', function () {
                plugin = new MigrationsPlugin({ fromVersion: '1.9.9', untilVersion: '2.0.0' });
                expect(plugin.checkVersion('2.0.0')).toBeTrue();
                plugin = new MigrationsPlugin({ fromVersion: '1.0.0', untilVersion: '3.0.0' });
                expect(plugin.checkVersion('2.0.0')).toBeTrue();
                plugin = new MigrationsPlugin({ fromVersion: function () { return '1.0.0'; }, untilVersion: function () { return '3.0.0'; } });
                expect(plugin.checkVersion('2.0.0')).toBeTrue();
            });
        });
        describe('when the version is not between the `fromVersion` (not included) and `untilVersion` (included)', function () {
            it('should return `true`', function () {
                plugin = new MigrationsPlugin({ fromVersion: '2.0.0', untilVersion: '2.0.0' });
                expect(plugin.checkVersion('2.0.0')).toBeFalse();
                plugin = new MigrationsPlugin({ fromVersion: '2.0.0', untilVersion: '2.0.1' });
                expect(plugin.checkVersion('2.0.0')).toBeFalse();
                plugin = new MigrationsPlugin({ fromVersion: '1.0.1', untilVersion: '1.9.3' });
                expect(plugin.checkVersion('2.0.0')).toBeFalse();
                plugin = new MigrationsPlugin({ fromVersion: function () { return '1.0.0'; }, untilVersion: function () { return '1.0.0'; } });
                expect(plugin.checkVersion('2.0.0')).toBeFalse();
            });
        });
    });
    describe('apply', function () {
        it('should call the migration handler', function () {
            plugin.store = 'store';
            plugin.migrations = [{
                    version: '1.8.4',
                    title: 'example',
                    handler: jest.fn()
                }];
            plugin.apply();
            expect(plugin.migrations[0].handler).toHaveBeenCalledWith(plugin.store);
        });
    });
});
//# sourceMappingURL=vuex-persist-migrations.spec.js.map