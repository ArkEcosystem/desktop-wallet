import { create as createTimersSandbox } from '@/services/plugin-manager/sandbox/timers-sandbox';
var routerNext = jest.fn();
var walletApi;
var app;
var sandbox;
beforeEach(function () {
    var routeCallbacks = [];
    walletApi = {};
    app = {
        $router: {
            beforeEach: jest.fn(function (callback) {
                routeCallbacks.push(callback);
            }),
            push: function () {
                for (var _i = 0, routeCallbacks_1 = routeCallbacks; _i < routeCallbacks_1.length; _i++) {
                    var callback = routeCallbacks_1[_i];
                    callback(null, null, routerNext);
                }
            }
        }
    };
    sandbox = createTimersSandbox(walletApi, app);
    sandbox();
});
describe('Timers Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.timers.clearInterval).toBeTruthy();
        expect(walletApi.timers.clearTimeout).toBeTruthy();
        expect(walletApi.timers.setInterval).toBeTruthy();
        expect(walletApi.timers.setTimeout).toBeTruthy();
    });
    it('should clear timer once setTimeout executed', function (done) {
        walletApi.timers.setTimeout(function () {
            setTimeout(function () {
                expect(walletApi.timers.timeouts.length).toEqual(0);
                done();
            }, 100);
        }, 1000);
        expect(walletApi.timers.timeouts.length).toEqual(1);
    });
    it('should clear timer if clearTimeout called', function (done) {
        expect(walletApi.timers.timeouts.length).toEqual(0);
        var id = walletApi.timers.setTimeout(function () {
            throw new Error('This setTimeout call should never execute');
        }, 1000);
        walletApi.timers.setTimeout(function () {
            done();
        }, 1000);
        expect(walletApi.timers.timeouts.length).toEqual(2);
        walletApi.timers.clearTimeout(id);
        expect(walletApi.timers.timeouts.length).toEqual(1);
    });
    it('should clear timer if clearInterval called', function (done) {
        expect(walletApi.timers.intervals.length).toEqual(0);
        var counter = 0;
        var id = walletApi.timers.setInterval(function () {
            counter++;
            if (counter === 5) {
                walletApi.timers.clearInterval(id);
                setTimeout(function () {
                    expect(walletApi.timers.intervals.length).toEqual(0);
                    expect(counter).toEqual(5);
                    done();
                }, 500);
            }
        }, 100);
        expect(walletApi.timers.intervals.length).toEqual(1);
    });
    it('should clear timers on route change', function () {
        walletApi.timers.setTimeout(function () {
            throw new Error('This setTimeout call will never execute');
        }, 10000);
        walletApi.timers.setInterval(function () {
            throw new Error('This setInterval call will never execute');
        }, 10000);
        expect(walletApi.timers.timeouts.length).toEqual(1);
        expect(walletApi.timers.intervals.length).toEqual(1);
        expect(app.$router.beforeEach).toHaveBeenCalledTimes(1);
        app.$router.push();
        expect(routerNext).toHaveBeenCalledTimes(1);
        expect(walletApi.timers.timeouts.length).toEqual(0);
        expect(walletApi.timers.intervals.length).toEqual(0);
    });
});
//# sourceMappingURL=timers-sandbox.spec.js.map