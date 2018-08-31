export const createIndexMock = jest.fn()
export const createMock = jest.fn()
export const deleteMock = jest.fn()
export const findMock = jest.fn()
export const storeMock = jest.fn()
export const updateMock = jest.fn()

const dbInstanceMock = {
  createIndex: createIndexMock,
  create: createMock,
  delete: deleteMock,
  find: findMock,
  store: storeMock,
  update: updateMock
}

export default dbInstanceMock
