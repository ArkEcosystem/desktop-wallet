import logger from 'electron-log'
import semver from 'semver'

export default class VuexMigrations {
  /**
   * @param {(String|Function)} fromVersion - From this migration version (included)
   * @param {(String|Function)} untilVersion - Until this migration version (included)
   */
  constructor ({ fromVersion, untilVersion }) {
    this.fromVersion = fromVersion
    this.untilVersion = untilVersion
  }

  /**
   * Webpack does not admit using a variable to indicate the path of the directory
   * @see https://webpack.js.org/guides/dependency-management/#require-context
   */
  get migrationsContext () {
    return require.context('../migrations', true, /\.js$/)
  }

  checkVersion (version) {
    if (!semver.valid(version)) {
      throw new Error(`The version "${version}" does not comply with semver`)
    }

    const from = typeof this.fromVersion === 'function' ? this.fromVersion(this.store) : this.fromVersion
    const until = typeof this.untilVersion === 'function' ? this.untilVersion(this.store) : this.untilVersion

    return semver.gt(version, from) && semver.lte(version, until)
  }

  collect () {
    this.migrations = []

    this.migrationsContext.keys().sort().forEach(key => {
      const [filename, version, title] = key.match(/\.\/(.*) - (.*)\.js/)

      if (this.checkVersion(version)) {
        const handler = this.migrationsContext(filename).default
        this.migrations.push({ version, title, handler })
      }
    })
  }

  apply () {
    this.migrations.forEach(migration => {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(`Applying migration ${migration.version}: ${migration.title}`)
      }
      migration.handler(this.store)
    })
  }

  /**
   * Integrates with `vuex-persist` and `vuex-persist-ready`
   */
  get plugin () {
    return store => {
      this.store = store

      this.store._vm.$root.$on('vuex-persist:ready', () => {
        this.collect()
        this.apply()
      })
    }
  }
}
