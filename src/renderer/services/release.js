// NOTE: uses a relative path because it is used on the `main` process too
import packageJson from '../../../package.json'

export default {
  get currentVersion () {
    return packageJson.version
  },

  get latestReleaseUrl () {
    // eslint-disable-next-line no-unused-vars
    const [, project] = packageJson.repository.url.match(/github.com\/(.*)\.git$/)
    return `https://github.com/${project}/releases/latest`
  }
}
