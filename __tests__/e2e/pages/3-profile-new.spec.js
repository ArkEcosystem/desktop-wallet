export default (scope) => {
  it('shows the instructions section', async () => {
    const hasInstructions = await scope.isExisting('.ProfileNew__instructions')
    expect(hasInstructions).toBeTrue()
  })
}
