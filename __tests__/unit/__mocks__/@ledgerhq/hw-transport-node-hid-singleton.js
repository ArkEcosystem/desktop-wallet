export default {
  create: jest.fn(() => {
    return {
      close: jest.fn(),
      disconected: false
    }
  })
}
