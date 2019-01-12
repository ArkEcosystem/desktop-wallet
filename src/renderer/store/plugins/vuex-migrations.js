import logger from 'electron-logger'
import semver from 'semver'
import { isFunction } from 'lodash'

/*
 * - Decide when to apply migrations
 * - Load migration files
 * - Apply migrations
 * - Mark migrations as applied
 */

export default class VuexMigrations {
  /**
   * @param {(String|Function)} fromVersion - From this migration version
   * @param {(String|Function)} untilVersion - Until this migration version
   */
  constructor ({ fromVersion, untilVersion }) {
    this.fromVersion = fromVersion
    this.untilVersion = untilVersion

    this.collect()
  }

  collect () {
    this.migrations = []

    /**
     * Webpack does not admit using a variable to indicate the path of the directory
     * @see https://webpack.js.org/guides/dependency-management/#require-context
     */
    const migrationsContext = require.context('../migrations', true, /\.js$/)

    migrationsContext.keys().sort().forEach(key => {
      const [filename, version, title] = key.match(/\.\/(.*) (.*)\.js/)

      if (!semver.valid(version)) {
        throw new Error(`The migration "${title}" does not use a valid semver version`)
      }

      const from = isFunction(this.fromVersion) ? this.fromVersion(this.store) : this.fromVersion
      const until = isFunction(this.untilVersion) ? this.untilVersion(this.store) : this.untilVersion

      // Include only those versions that are lesser or equal TODO between
      if (semver.gte(version, from) && semver.lte(version, until)) {
        const handler = migrationsContext(filename).default
        this.migrations.push({ version, title, handler })
      }
    })
  }

  apply () {
    this.migrations.forEach(migration => {
      logger.debug(`Appliying migration ${migration.version}: ${migration.title}`)
      migration.handler(this.store)
    })
  }

  /**
   * Integrates with `vuex-persist`
   */
  get plugin () {
    return store => {
      this.store = store

      const unsubscribe = store.subscribe((mutation, state) => {
        if (mutation.type === 'RESTORE_MUTATION') {
          unsubscribe()

          this.apply()
        }
      })
    }
  }
}
