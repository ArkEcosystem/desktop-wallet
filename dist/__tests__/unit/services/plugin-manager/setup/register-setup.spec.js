import { create as createRegisterSetup } from '@/services/plugin-manager/setup/register-setup';
var pluginObject = {
    register: jest.fn()
};
var registerSetup = createRegisterSetup(pluginObject);
registerSetup();
describe('Register Setup', function () {
    it('should call the register method', function () {
        expect(pluginObject.register).toHaveBeenCalled();
    });
});
//# sourceMappingURL=register-setup.spec.js.map