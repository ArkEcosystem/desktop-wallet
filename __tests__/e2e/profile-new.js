import setup from '@setup'

describe('ProfileNew', () => {
  const scope = {}

  beforeEach(async () => setup.startApp(scope), 10000)
  afterEach(async () => setup.stopApp(scope), 10000)

  beforeEach(async () => {
    await scope.app.client.waitUntilWindowLoaded()
    // This commands doen't work
    // scope.url('profile/new')

    // It's necessary to navigate manually
    // const link = scope.element('#profileLink')
    // link.click()
    // or
    // await scope.app.client.click('#profileLink')
  }, 5000)

  it('should open 1 window only', async () => {
    const count = await scope.app.client.getWindowCount()
    expect(count).toBe(1)
  })

  xit('should display the avatar selection', async () => {
    await scope.app.client.waitUntilWindowLoaded()
    const visible = await scope.isVisible('.SelectionAvatar')
    expect(visible).toBeTruthy()
  })
})
