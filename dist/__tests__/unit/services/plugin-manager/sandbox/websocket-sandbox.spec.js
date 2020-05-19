import { Server } from 'mock-socket';
import { create as createWebsocketSandbox } from '@/services/plugin-manager/sandbox/websocket-sandbox';
var whitelist = [
    /* eslint-disable: no-useless-escape */
    '^ws:\\/\\/.*\\.test\\.com:8080$'
];
var host = 'ws://my.test.com:8080';
var plugin = {
    config: {
        urls: whitelist
    }
};
var app;
var sandbox;
var walletApi;
var pongMock;
var mockServer;
var routerNext;
beforeEach(function () {
    if (mockServer) {
        mockServer.stop();
    }
    pongMock = jest.fn(function (data) {
        if (data === 'ping') {
            mockServer.emit('pong', true);
        }
    });
    mockServer = new Server(host);
    mockServer.on('connection', function (socket) {
        mockServer.emit('data', 'test');
        socket.on('message', pongMock);
    });
    mockServer.on('message', function () {
        mockServer.emit('data', 'test');
    });
    var routeCallbacks = [];
    routerNext = jest.fn();
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
    sandbox = createWebsocketSandbox(walletApi, app, plugin);
    sandbox();
});
describe('PluginWebsocket', function () {
    it('should expose functions', function () {
        expect(walletApi.websocket).toBeTruthy();
    });
    it('should connect to websocket', function (done) {
        var socket = walletApi.websocket.connect(host);
        expect(socket.isConnecting()).toBeTrue();
        setTimeout(function () {
            expect(socket.isOpen()).toBeTrue();
            done();
        }, 100);
    });
    it('should connect to websocket and receive data', function (done) {
        var socket = walletApi.websocket.connect(host);
        socket.on('data', function (event) {
            expect(event.data).toEqual('test');
            expect(event.origin).toEqual('ws://my.test.com:8080/');
            expect(event.timestamp).toBeTruthy();
            done();
        });
    });
    it('should connect to websocket and send data', function (done) {
        var socket = walletApi.websocket.connect(host);
        socket.on('pong', function (event) {
            expect(pongMock).toHaveBeenCalledWith('ping');
            expect(event.data).toEqual('true');
            expect(event.origin).toEqual('ws://my.test.com:8080/');
            expect(event.timestamp).toBeTruthy();
            done();
        });
        socket.send('ping');
    });
    it('should change the binary type to arraybuffer', function () {
        var socket = walletApi.websocket.connect(host);
        socket.binaryType = 'arraybuffer';
        expect(socket.binaryType).toBe('arraybuffer');
    });
    it('should close the websocket', function (done) {
        var socket = walletApi.websocket.connect(host);
        setTimeout(function () {
            expect(socket.isOpen()).toBeTrue();
            socket.close();
            expect(socket.isClosing()).toBeTrue();
            setTimeout(function () {
                expect(socket.isClosed()).toBeTrue();
            }, 500);
        }, 500);
        socket.on('close', function (event) {
            expect(event.clean).toBeFalse();
            expect(event.timestamp).toBeTruthy();
            done();
        });
    });
    it('should reset websockets on route change', function () {
        var socket = walletApi.websocket.connect(host);
        socket.on('pong', jest.fn());
        expect(socket.events.pong).toBeTruthy();
        expect(app.$router.beforeEach).toHaveBeenCalledTimes(1);
        app.$router.push();
        expect(routerNext).toHaveBeenCalledTimes(1);
        expect(socket.events.length).toEqual(0);
    });
    it('should not connect to websocket', function (done) {
        var socket = walletApi.websocket.connect('ws://failure.test.com:8080');
        setTimeout(function () {
            expect(socket.isClosed()).toBeTrue();
            done();
        }, 500);
    });
    it('should not connect to websocket due to whitelist', function () {
        expect(function () {
            walletApi.websocket.connect('ws://my.test.com:8081');
        }).toThrow('URL "ws://my.test.com:8081" not allowed');
    });
    it('should destroy the socket', function () {
        var socket = walletApi.websocket.connect(host);
        socket.destroy();
        expect(socket.isDestroyed()).toBeTrue();
    });
    it('should ignore an invalid whitelist', function () {
        expect(function () {
            var api = {};
            createWebsocketSandbox(api, app, {
                config: {
                    url: 'not a whitelist'
                }
            })();
            api.websocket.connect('ws://my.test.com:8081');
        }).toThrow('URL "ws://my.test.com:8081" not allowed');
    });
});
//# sourceMappingURL=websocket-sandbox.spec.js.map