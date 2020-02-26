import { create as createRegisterSetup } from '@/services/plugin-manager/setup/register-setup'

const pluginObject = {
  register: jest.fn()
}

const registerSetup = createRegisterSetup(pluginObject)
registerSetup()

describe('Register Setup', () => {
  it('should call the register method', () => {
    expect(pluginObject.register).toHaveBeenCalled()
  })
})
