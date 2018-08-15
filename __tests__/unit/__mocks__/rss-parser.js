export const parseURLMock = jest.fn()

const RssParserMock = jest.fn().mockImplementation(() => {
  return { parseURL: parseURLMock }
})

export default RssParserMock
