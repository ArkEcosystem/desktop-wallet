import MigrationsPlugin from '@/store/plugins/vuex-persist-migrations'

describe('Migrations plugin', () => {
  let plugin
  const fromVersion = '1.0.0'
  const untilVersion = '2.0.2'

  beforeAll(() => {
    plugin = new MigrationsPlugin({ fromVersion, untilVersion })
    plugin.migrations = []
  })

  describe('checkVersion', () => {
    describe('when the version does not follow semver rules', () => {
      it('should throw an Error', () => {
        expect(() => plugin.checkVersion('no')).toThrow(/semver/)
      })
    })

    describe('when the version is between the `fromVersion` (not included) and `untilVersion` (included)', () => {
      it('should return `true`', () => {
        plugin = new MigrationsPlugin({ fromVersion: '1.9.9', untilVersion: '2.0.0' })
        expect(plugin.checkVersion('2.0.0')).toBeTrue()

        plugin = new MigrationsPlugin({ fromVersion: '1.0.0', untilVersion: '3.0.0' })
        expect(plugin.checkVersion('2.0.0')).toBeTrue()

        plugin = new MigrationsPlugin({ fromVersion: () => '1.0.0', untilVersion: () => '3.0.0' })
        expect(plugin.checkVersion('2.0.0')).toBeTrue()
      })
    })

    describe('when the version is not between the `fromVersion` (not included) and `untilVersion` (included)', () => {
      it('should return `true`', () => {
        plugin = new MigrationsPlugin({ fromVersion: '2.0.0', untilVersion: '2.0.0' })
        expect(plugin.checkVersion('2.0.0')).toBeFalse()

        plugin = new MigrationsPlugin({ fromVersion: '2.0.0', untilVersion: '2.0.1' })
        expect(plugin.checkVersion('2.0.0')).toBeFalse()

        plugin = new MigrationsPlugin({ fromVersion: '1.0.1', untilVersion: '1.9.3' })
        expect(plugin.checkVersion('2.0.0')).toBeFalse()

        plugin = new MigrationsPlugin({ fromVersion: () => '1.0.0', untilVersion: () => '1.0.0' })
        expect(plugin.checkVersion('2.0.0')).toBeFalse()
      })
    })
  })

  describe('apply', () => {
    it('should call the migration handler', () => {
      plugin.store = 'store'
      plugin.migrations = [{
        version: '1.8.4',
        title: 'example',
        handler: jest.fn()
      }]

      plugin.apply()

      expect(plugin.migrations[0].handler).toHaveBeenCalledWith(plugin.store)
    })
  })
})
