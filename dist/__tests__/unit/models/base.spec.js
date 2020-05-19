import BaseModel from '@/models/base';
import emptySchema from '@tests/unit/__fixtures__/models/empty';
import rigidSchema from '@tests/unit/__fixtures__/models/rigid';
describe('BaseModel', function () {
    it('should create a model', function () {
        var model = new BaseModel(emptySchema);
        expect(model).toBeInstanceOf(BaseModel);
    });
    describe('Validation', function () {
        var rigidModel;
        var item;
        beforeEach(function () {
            rigidModel = new BaseModel(rigidSchema);
            item = { integer: 1, timestamp: new Date().getTime() };
        });
        it('should be instatiated', function () {
            expect(rigidModel).toBeInstanceOf(BaseModel);
        });
        it('should format properties', function () {
            var properties = rigidModel.formatProperties(item);
            expect(properties).toBeObject();
            expect(properties.integer.value).toBeNumber();
            expect(properties.date.value).toBeDate();
        });
        it('should deserialize', function () {
            var doc = rigidModel.deserialize(item);
            expect(doc).toContainAllKeys(['date', 'integer', 'timestamp']);
        });
    });
});
//# sourceMappingURL=base.spec.js.map