import packageJson from '@package.json'

export default (scope) => {
  it('shows the proper application title', async () => {
    const title = await scope.app.client.getTitle()
    expect(title.toLowerCase()).toContain(packageJson.build.productName.toLowerCase())
  })
}
