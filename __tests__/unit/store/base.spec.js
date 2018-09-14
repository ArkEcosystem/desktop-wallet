import BaseModule from '@/store/base'

describe('BaseModule', () => {
  let modeler
  let module
  let item

  beforeAll(() => {
    modeler = { deserialize: (data) => data }
    module = new BaseModule(modeler)
    item = modeler.deserialize({ id: 'test' })
  })

  it('should create a module', () => {
    expect(module).toBeInstanceOf(Object)
  })

  it('should contains crud methods', () => {
    expect(module.actions).toContainKeys(['create', 'update', 'delete', 'store'])
  })

  it('should create a item', () => {
    module.mutations.CREATE(module.state, item)
    expect(module.state.all.length).toBeGreaterThan(0)
    expect(module.getters.byId(module.state)(item.id)).toBe(item)
  })

  it('should update a item', () => {
    item = modeler.deserialize({ id: 'test', name: 'ark' })
    module.mutations.UPDATE(module.state, item)
    expect(module.getters.byId(module.state)(item.id)).toBe(item)
  })

  it('should delete a item', () => {
    module.mutations.DELETE(module.state, item.id)
    expect(module.getters.all(module.state)).toBeEmpty()
  })
})
