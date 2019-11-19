export default jest.fn().mockImplementation(() => ({
  compileTemplate: jest.fn((vm, template) => {
    const { compileToFunctions } = require('vue-template-compiler')
    return compileToFunctions(template)
  })
}))
