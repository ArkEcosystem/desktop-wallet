var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createLocalVue, shallowMount } from '@vue/test-utils';
import useI18n from '../__utils__/i18n';
import ElectronMixin from '@/mixins/electron';
import electron from 'electron';
jest.mock('electron', function () { return ({
    remote: {
        dialog: {
            showOpenDialog: jest.fn(),
            showSaveDialog: jest.fn()
        }
    }
}); });
jest.mock('fs', function () { return ({
    writeFileSync: jest.fn(),
    readFileSync: jest.fn()
}); });
describe('Mixins > Electron', function () {
    var wrapper;
    beforeEach(function () {
        var localVue = createLocalVue();
        var i18n = useI18n(localVue);
        var TestComponent = {
            name: 'TestComponent',
            template: '<div/>'
        };
        wrapper = shallowMount(TestComponent, {
            localVue: localVue,
            i18n: i18n,
            mixins: [ElectronMixin]
        });
    });
    describe('electron_writeFile', function () {
        var showSaveDialogMock;
        beforeEach(function () {
            showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(function () { return ({
                filePath: 'filePath'
            }); });
        });
        afterEach(function () {
            showSaveDialogMock.mockRestore();
        });
        it('should return early when the obtained filePath is falsy', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(function () { return ({
                            filePath: undefined
                        }); });
                        return [4 /*yield*/, expect(wrapper.vm.electron_writeFile()).resolves.toEqual(undefined)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when passing filters', function () {
            var defaultFilters = [
                { name: 'JSON', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
            ];
            it('should not modify a FileFilter array', function () { return __awaiter(void 0, void 0, void 0, function () {
                var filters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = [{
                                    name: 'FOOBAR', extensions: ['foobar']
                                }];
                            return [4 /*yield*/, wrapper.vm.electron_writeFile('raw', 'path', { filters: filters })];
                        case 1:
                            _a.sent();
                            expect(showSaveDialogMock).toHaveBeenCalledWith({
                                defaultPath: 'path',
                                filters: filters
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should parse a single string correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
                var filters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = [{
                                    name: 'FOOBAR', extensions: ['foobar']
                                }];
                            return [4 /*yield*/, wrapper.vm.electron_writeFile('raw', 'path', { filters: 'foobar' })];
                        case 1:
                            _a.sent();
                            expect(showSaveDialogMock).toHaveBeenCalledWith({
                                defaultPath: 'path',
                                filters: filters
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should parse an array of strings correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
                var filters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = [
                                { name: 'FOO', extensions: ['foo'] },
                                { name: 'BAR', extensions: ['bar'] }
                            ];
                            return [4 /*yield*/, wrapper.vm.electron_writeFile('raw', 'path', { filters: ['foo', 'bar'] })];
                        case 1:
                            _a.sent();
                            expect(showSaveDialogMock).toHaveBeenCalledWith({
                                defaultPath: 'path',
                                filters: filters
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it.each([null, undefined])('should fallback to the default filters when filters is falsy', function (filters) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wrapper.vm.electron_writeFile('raw', 'path', { filters: filters })];
                        case 1:
                            _a.sent();
                            expect(showSaveDialogMock).toHaveBeenCalledWith({
                                defaultPath: 'path',
                                filters: defaultFilters
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when restricting the file path', function () {
            it('should not throw an error if the given filepath is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(function () { return ({
                                filePath: '/home/foo/bar'
                            }); });
                            return [4 /*yield*/, expect(wrapper.vm.electron_writeFile(null, null, { restrictToPath: '/home/foo' })).resolves.not.toThrow()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw an error if the given filepath is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(function () { return ({
                                filePath: '/home/bar/foo'
                            }); });
                            return [4 /*yield*/, expect(wrapper.vm.electron_writeFile(null, null, { restrictToPath: '/home/foo' })).rejects.toThrow()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('electron_readFile', function () {
        var showOpenDialogMock;
        beforeEach(function () {
            showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(function () { return ({
                filePaths: ['filePath']
            }); });
        });
        afterEach(function () {
            showOpenDialogMock.mockRestore();
        });
        it('should return early when the obtained filePaths is falsy', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(function () { return ({
                            filePaths: undefined
                        }); });
                        return [4 /*yield*/, expect(wrapper.vm.electron_readFile()).resolves.toEqual(undefined)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when restricting the file path', function () {
            it('should not throw an error if the given filepath is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(function () { return ({
                                filePaths: ['/home/foo/bar']
                            }); });
                            return [4 /*yield*/, expect(wrapper.vm.electron_readFile(null, { restrictToPath: '/home/foo' })).resolves.not.toThrow()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw an error if the given filepath is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(function () { return ({
                                filePaths: ['/home/bar/foo']
                            }); });
                            return [4 /*yield*/, expect(wrapper.vm.electron_readFile(null, { restrictToPath: '/home/foo' })).rejects.toThrow()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=electron.spec.js.map