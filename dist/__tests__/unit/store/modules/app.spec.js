import store from '@/store';
describe('app store module', function () {
    beforeEach(function () {
        store.dispatch('app/setPinCode', 123456);
    });
    it('should set pin code', function () {
        expect(store.state.app.pinCode).toBe(123456);
    });
    it('should getter be "enabled"', function () {
        expect(store.getters['app/pinCodeEnabled']).toBeTruthy();
    });
});
//# sourceMappingURL=app.spec.js.map