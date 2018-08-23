export const pluginMock = jest.fn()
export const debugDisableMock = jest.fn()
export const debugEnableMock = jest.fn()

export const createIndexMock = jest.fn()
export const allDocsMock = jest.fn()
export const getMock = jest.fn()
export const infoMock = jest.fn()
export const putMock = jest.fn()
export const putIfNotExistsMock = jest.fn()
export const upsertMock = jest.fn()
export const removeMock = jest.fn()

const PouchDBMock = jest.fn().mockImplementation(() => {
  return {
    createIndex: createIndexMock,
    allDocs: allDocsMock,
    get: getMock,
    info: infoMock,
    put: putMock,
    putIfNotExists: putIfNotExistsMock,
    upsert: upsertMock,
    remove: removeMock
  }
})

PouchDBMock.plugin = pluginMock

PouchDBMock.debug = {
  enable: debugEnableMock,
  disable: debugDisableMock
}

export default PouchDBMock
