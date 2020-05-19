var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import SynchronizerService from '@/services/synchronizer';
describe('Services > Synchronizer', function () {
    var synchronizer;
    beforeEach(function () {
        synchronizer = new SynchronizerService({});
    });
    describe('define', function () {
        var actionId = 'example';
        var actionFn = jest.fn();
        it('should require the `default` mode configuration', function () {
            var config = {
                focus: { interval: 1000 }
            };
            expect(function () { return synchronizer.define(actionId, config, actionFn); }).not.toThrow(/default.*mode/);
        });
        it('should require the `focus` mode configuration', function () {
            var config = {
                default: { interval: 10000 }
            };
            expect(function () { return synchronizer.define(actionId, config, actionFn); }).not.toThrow(/focus.*mode/);
        });
        it('should not allow using 0 as interval', function () {
            var config = {
                default: { interval: 0 },
                focus: { interval: 0 }
            };
            expect(function () { return synchronizer.define(actionId, config, actionFn); }).toThrow(/interval/);
        });
        it('should allow using `null` as interval', function () {
            var config = {
                default: { interval: null },
                focus: { interval: null }
            };
            expect(function () { return synchronizer.define(actionId, config, actionFn); }).not.toThrow();
        });
        it('should store the action by ID', function () {
            var config = {
                default: { interval: 10000 },
                focus: { interval: 1000 }
            };
            synchronizer.define(actionId, config, actionFn);
            expect(synchronizer).toHaveProperty("actions." + actionId, __assign({ calledAt: 0, isCalling: false, fn: actionFn }, config));
        });
    });
    describe('focus', function () {
        it('should add the actions to the `focused` Array', function () {
            synchronizer.focused = [];
            synchronizer.focus('example');
            expect(synchronizer).toHaveProperty('focused', ['example']);
            synchronizer.focused = [];
            synchronizer.focus(['example']);
            expect(synchronizer).toHaveProperty('focused', ['example']);
        });
        it('should remove the actions from the `paused` the Array', function () {
            synchronizer.paused = ['example', 'other'];
            synchronizer.focus('example');
            expect(synchronizer).toHaveProperty('paused', ['other']);
            synchronizer.paused = ['example', 'other'];
            synchronizer.focus(['example']);
            expect(synchronizer).toHaveProperty('paused', ['other']);
        });
    });
    describe('pause', function () {
        it('should add the actions to the `paused` Array', function () {
            synchronizer.paused = [];
            synchronizer.pause('example');
            expect(synchronizer).toHaveProperty('paused', ['example']);
            synchronizer.paused = [];
            synchronizer.pause(['example']);
            expect(synchronizer).toHaveProperty('paused', ['example']);
        });
    });
    describe('unpause', function () {
        it('should remove the actions from the `paused` the Array', function () {
            synchronizer.paused = ['example', 'other'];
            synchronizer.unpause('example');
            expect(synchronizer).toHaveProperty('paused', ['other']);
            synchronizer.paused = ['example', 'other'];
            synchronizer.unpause(['example']);
            expect(synchronizer).toHaveProperty('paused', ['other']);
        });
    });
});
//# sourceMappingURL=synchronizer.spec.js.map