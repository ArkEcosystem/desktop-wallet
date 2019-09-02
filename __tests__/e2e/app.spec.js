import setup from '@setup'

import windowSpecs from './pages/1-window.spec'
import welcomeSpecs from './pages/2-welcome.spec'
import profileNewSpecs from './pages/3-profile-new.spec'

describe('App', () => {
  const scope = {}

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()
  })

  afterAll(() => setup.stopApp(scope))

  describe('Window', () => windowSpecs(scope))
  describe('Welcome', () => welcomeSpecs(scope))
  describe('Profile new', () => profileNewSpecs(scope))
})
