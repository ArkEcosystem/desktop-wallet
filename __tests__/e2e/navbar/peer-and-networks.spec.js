import setup from '@setup'
import Navbar from '@pages/Navbar'

describe('Navbar > peer and networks', () => {
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

  describe('networks button', () => {
    it('should be displayed', async () => {
      const $networks = navbar.$networks

      await expect(browser.isExisting($networks)).resolves.toBeTrue()
      await expect(browser.waitForVisible($networks, 1)).resolves.toBeTrue()
    })

    // FIXME the button is not activated even using manually the console
    xdescribe('clicking on it', () => {
      it('should open to the network/peer menu', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$networks)
      })
    })
  })
})
