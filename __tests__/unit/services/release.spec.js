import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import errorCapturer from '../__utils__/error-capturer'

import release from '@/services/release'

const releaseApiUrl =
  'https://api.github.com/repos/ArkEcosystem/desktop-wallet/releases/latest'
const releaseUrl =
  'https://github.com/ArkEcosystem/desktop-wallet/releases/latest'

describe('Services > Release', () => {
  describe('latestReleaseApiUrl', () => {
    it('returns the URL of the latest release API endpoint', () => {
      expect(release.latestReleaseApiUrl).toEqual(releaseApiUrl)
    })
  })

  describe('latestReleaseUrl', () => {
    it('returns the URL of the latest release endpoint', () => {
      expect(release.latestReleaseUrl).toEqual(releaseUrl)
    })
  })

  describe('fetchLatestRelease', () => {
    it('should fetch the latest published release', async () => {
      const data = { tag_name: '2.0.0' }

      const mock = new MockAdapter(axios)
      mock.onGet(releaseApiUrl).reply(200, data)

      expect(await release.fetchLatestRelease()).toEqual(data)
    })

    describe('when the request or parsing fails', () => {
      it('should throw the Error', async () => {
        const mock = new MockAdapter(axios)
        mock.onGet(releaseApiUrl).reply(500)

        expect(await errorCapturer(release.fetchLatestRelease())).toThrow(/500/)
      })
    })
  })
})
