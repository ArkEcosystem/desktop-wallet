import setup from '@setup'
import Navbar from '@pages/Navbar'

describe('Navbar > settings', () => {
  let scope = {}
  let browser
  let navbar

  beforeEach(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    navbar = new Navbar(browser)

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()

    await scope.navigateTo('/')
  })

  afterEach(() => setup.stopApp(scope))

  describe('settings button', () => {
    it('should be displayed', async () => {
      const $settings = navbar.$settings

      await expect(browser.isExisting($settings)).resolves.toBeTrue()
      await expect(browser.waitForVisible($settings, 1)).resolves.toBeTrue()
    })

    // FIXME the button is not activated even using manually the console
    xdescribe('clicking on it', () => {
      it('should open the settings menu', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$settings)

        await browser.pause(1000000)
      })
    })
  })
})
