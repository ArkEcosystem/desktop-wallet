export default method => {
  let consoleMethod

  beforeEach(() => {
    consoleMethod = console[method]
    console[method] = jest.fn()
  })

  afterEach(() => {
    console[method] = consoleMethod
  })
}
