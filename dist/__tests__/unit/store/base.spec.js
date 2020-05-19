import BaseModule from '@/store/base';
describe('BaseModule', function () {
    var modeler;
    var module;
    var item;
    beforeAll(function () {
        modeler = { deserialize: function (data) { return data; } };
        module = new BaseModule(modeler);
        item = modeler.deserialize({ id: 'test' });
    });
    it('should create a module', function () {
        expect(module).toBeInstanceOf(Object);
    });
    it('should contains crud methods', function () {
        expect(module.actions).toContainKeys(['create', 'update', 'delete', 'store']);
    });
    it('should create a item', function () {
        module.mutations.CREATE(module.state, item);
        expect(module.state.all.length).toBeGreaterThan(0);
        expect(module.getters.byId(module.state)(item.id)).toBe(item);
    });
    it('should update a item', function () {
        item = modeler.deserialize({ id: 'test', name: 'ark' });
        module.mutations.UPDATE(module.state, item);
        expect(module.getters.byId(module.state)(item.id)).toBe(item);
    });
    it('should delete a item', function () {
        module.mutations.DELETE(module.state, item.id);
        expect(module.getters.all(module.state)).toBeEmpty();
    });
});
//# sourceMappingURL=base.spec.js.map