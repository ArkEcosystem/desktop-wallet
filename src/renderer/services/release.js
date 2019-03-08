import Http from '@/services/http'
// NOTE: uses a relative path because it is used on the `main` process too
import packageJson from '../../../package.json'

export default {
  get currentVersion () {
    return packageJson.version
  },

  get latestReleaseUrl () {
    // eslint-disable-next-line no-unused-vars
    const [_, project] = packageJson.repository.url.match(/github.com\/(.*)\.git$/)
    return `https://github.com/${project}/releases/latest`
  },

  get latestReleaseApiUrl () {
    // eslint-disable-next-line no-unused-vars
    const [_, project] = packageJson.repository.url.match(/github.com\/(.*)\.git$/)
    return `https://api.github.com/repos/${project}/releases/latest`
  },

  /**
   * Fetches the latest published release
   * @return {Object} the release data
   */
  async fetchLatestRelease (url) {
    const httpClient = new Http()
    const response = await httpClient.get(this.latestReleaseApiUrl)
    return response.data
  }
}
