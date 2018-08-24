import setup from '@setup'

describe('Dashboard', () => {
  const scope = {}

  beforeEach(async () => setup.startApp(scope), 10000)
  afterEach(() => setup.stopApp(scope), 10000)

  it('displays a logo image', async () => {
    const src = await scope.getAttribute('#logo', 'src')
    expect(src).toMatch(/imgs\/logo--assets\.png/)
  })
})
