import setup from '@setup'
import packageJson from '@package.json'

xdescribe('App > Window', () => {
  let scope = {}

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()
  })

  afterAll(() => setup.stopApp(scope))

  it('shows the proper application title', async () => {
    const title = await scope.app.client.getTitle()
    expect(title.toLowerCase()).toContain(packageJson.build.productName.toLowerCase())
  })
})
