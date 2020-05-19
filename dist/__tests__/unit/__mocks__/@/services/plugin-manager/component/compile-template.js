export default jest.fn().mockImplementation(function () { return ({
    compileTemplate: jest.fn(function (vm, template) {
        var compileToFunctions = require('vue-template-compiler').compileToFunctions;
        return compileToFunctions(template);
    })
}); });
//# sourceMappingURL=compile-template.js.map