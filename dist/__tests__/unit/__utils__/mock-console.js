export default (function (method) {
    var consoleMethod;
    beforeEach(function () {
        consoleMethod = console[method];
        console[method] = jest.fn();
    });
    afterEach(function () {
        console[method] = consoleMethod;
    });
});
//# sourceMappingURL=mock-console.js.map