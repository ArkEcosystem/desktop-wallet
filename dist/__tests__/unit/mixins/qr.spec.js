import { shallowMount } from '@vue/test-utils';
import QrMixin from '@/mixins/qr';
describe('Mixins > Qr', function () {
    var wrapper;
    beforeEach(function () {
        var TestComponent = {
            name: 'TestComponent',
            template: '<div/>'
        };
        wrapper = shallowMount(TestComponent, {
            mixins: [QrMixin]
        });
    });
    describe('qr_getAddress', function () {
        it('should return an address from an uri string', function () {
            expect(wrapper.vm.qr_getAddress('ark:AewxfHQobSc49a4radHp74JZCGP8LRe4xA')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA');
        });
        it('should return an address from a json object with the "a" property', function () {
            expect(wrapper.vm.qr_getAddress('{"a": "AewxfHQobSc49a4radHp74JZCGP8LRe4xA"}')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA');
        });
        it('should return an address from a json object with the "address" property', function () {
            expect(wrapper.vm.qr_getAddress('{"address": "AewxfHQobSc49a4radHp74JZCGP8LRe4xA"}')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA');
        });
        it('should return an address from string', function () {
            expect(wrapper.vm.qr_getAddress('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA');
        });
        it('should return undefined or the same string from an incorrect entry', function () {
            expect(wrapper.vm.qr_getAddress('ark:address')).toEqual('ark:address');
            expect(wrapper.vm.qr_getAddress('{"b": "address"}')).toBeUndefined();
            expect(wrapper.vm.qr_getAddress('asdf')).toEqual('asdf');
        });
    });
    describe('qr_getPassphrase', function () {
        it('should return a passphrase from a json object', function () {
            expect(wrapper.vm.qr_getPassphrase('{"passphrase": "this is a top secret passphrase"}')).toEqual('this is a top secret passphrase');
        });
        it('should return a passphrase from string', function () {
            expect(wrapper.vm.qr_getPassphrase('this is a top secret passphrase')).toEqual('this is a top secret passphrase');
        });
        it('should return undefined or the same string from an incorrect entry', function () {
            expect(wrapper.vm.qr_getPassphrase('{"asdf": "this is a top secret passphrase"}')).toBeUndefined();
            expect(wrapper.vm.qr_getPassphrase('asdf')).toEqual('asdf');
        });
    });
});
//# sourceMappingURL=qr.spec.js.map