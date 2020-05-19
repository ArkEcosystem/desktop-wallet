export var parseURLMock = jest.fn();
var RssParserMock = jest.fn().mockImplementation(function () {
    return { parseURL: parseURLMock };
});
export default RssParserMock;
//# sourceMappingURL=rss-parser.js.map