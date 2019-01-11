import { cloneDeep } from 'lodash'
import semver from 'semver'

/*
 * - Decide when to apply migrations
 * - Load migration files
 * - Apply migrations
 * - Mark migrations as applied
 */

export default class VuexMigrations {
  constructor ({ untilVersion }) {
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
      const [filename, version, title] = key.match(/\.\/(.*) - (.*)\.js/)

      if (!semver.valid(version)) {
        throw new Error(`The migration "${title}" does not use a valid semver version`)
      }

      // Include only those versions that are lesser or equal
      if (semver.lte(version, this.untilVersion)) {
        const migration = migrationsContext(filename).default
        this.migrations.push(migration)
      }
    })
  }

  apply () {
    this.migrations.forEach(migration => {
      migration(this.snapshot, this.snapshot)
    })
    console.log('applied')
  }

  get plugin () {
    return store => {
      const unsubscribe = store.subscribe((mutation, state) => {
        if (mutation.type === 'RESTORE_MUTATION') {
          unsubscribe()

          this.snapshot = cloneDeep(state)
          this.apply()
        }
      })
    }
  }
}
