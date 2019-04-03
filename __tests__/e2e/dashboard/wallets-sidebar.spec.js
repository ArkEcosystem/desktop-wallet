import setup from '@setup'
import Dashboard from '@pages/Dashboard'

describe('Dashboard > wallets sidebar', () => {
  let scope = {}
  let browser
  let dashboard
  let $importWallet
  let $createWallet

  beforeEach(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    dashboard = new Dashboard(browser)

    $createWallet = dashboard.$createWallet
    $importWallet = dashboard.$importWallet

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()

    // Navigating takes some time
    await scope.navigateTo('/')
    await browser.pause(10)
  })

  afterEach(() => setup.stopApp(scope))

  describe('create wallet button', () => {
    it('should be displayed', async () => {
      await expect(browser.isExisting($createWallet)).resolves.toBeTrue()
      await expect(browser.waitForVisible($createWallet, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the new wallet page', async () => {
        await browser.click($createWallet)
        await expect(browser.getUrl()).resolves.toMatch('#/wallets/new')
      })
    })
  })

  describe('import wallet button', () => {
    it('should be displayed', async () => {
      await expect(browser.isExisting($importWallet)).resolves.toBeTrue()
      await expect(browser.waitForVisible($importWallet, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the import wallet page', async () => {
        await browser.click($importWallet)
        await expect(browser.getUrl()).resolves.toMatch('#/wallets/import')
      })
    })
  })
})
