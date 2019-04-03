import setup from '@setup'
import NewProfile from '@pages/NewProfile'

describe('Profiles > create new profiles', () => {
  let scope = {}
  let browser
  let newProfile

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    newProfile = new NewProfile(browser)

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()

    await scope.navigateTo('/profiles/new')
  })

  afterAll(() => setup.stopApp(scope))

  it('should display the instructions section', async () => {
    const $instructions = newProfile.$instructions

    await expect(browser.isExisting($instructions)).resolves.toBeTrue()
    await expect(browser.waitForVisible($instructions, 1)).resolves.toBeTrue()
  })
})
