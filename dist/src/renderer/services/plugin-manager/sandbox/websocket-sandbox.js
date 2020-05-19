var PluginWebsocket = /** @class */ (function () {
    function PluginWebsocket(whitelist, router) {
        this.whitelist = [];
        this.router = router;
        if (Array.isArray(whitelist)) {
            this.whitelist = whitelist.map(function (regex) {
                return new RegExp(regex);
            });
        }
    }
    PluginWebsocket.prototype.validateUrl = function (url) {
        var valid = false;
        for (var _i = 0, _a = this.whitelist; _i < _a.length; _i++) {
            var regex = _a[_i];
            if (regex.test(url)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            throw new Error("URL \"" + url + "\" not allowed");
        }
    };
    PluginWebsocket.prototype.connect = function (url) {
        this.validateUrl(url);
        var websocket = new WebSocket(url);
        var websocketEvents = {
            events: [],
            clear: function () {
                for (var eventId in this.events) {
                    websocket.removeEventListener(eventId, this.events[eventId]);
                }
                this.events = [];
            },
            on: function (action, eventCallback) {
                var eventTrigger = function (event) {
                    var result = {};
                    if (event.data) {
                        result.data = event.data;
                    }
                    if (event.origin) {
                        result.origin = event.origin;
                    }
                    if (event.wasClean !== undefined) {
                        result.clean = event.wasClean;
                    }
                    result.timestamp = event.timeStamp;
                    eventCallback(result);
                };
                websocket.addEventListener(action, eventTrigger);
                this.events[action] = eventTrigger;
            },
            get binaryType() {
                return websocket && websocket.binaryType;
            },
            set binaryType(type) {
                websocket.binaryType = type;
            },
            close: function () {
                websocket.close();
            },
            destroy: function () {
                if (websocket) {
                    if (!websocketEvents.isClosing() && !websocketEvents.isClosed()) {
                        websocket.close();
                    }
                    websocketEvents.clear();
                }
                websocket = null;
            },
            send: function (data) {
                websocket.send(data);
            },
            isConnecting: function () {
                return websocket && websocket.readyState === WebSocket.CONNECTING;
            },
            isDestroyed: function () {
                return websocket === null;
            },
            isOpen: function () {
                return websocket && websocket.readyState === WebSocket.OPEN;
            },
            isClosing: function () {
                return websocket && websocket.readyState === WebSocket.CLOSING;
            },
            isClosed: function () {
                return websocket && websocket.readyState === WebSocket.CLOSED;
            }
        };
        this.router.beforeEach(function (_, __, next) {
            websocketEvents.destroy();
            next();
        });
        return websocketEvents;
    };
    return PluginWebsocket;
}());
export function create(walletApi, app, plugin) {
    return function () {
        walletApi.websocket = new PluginWebsocket(plugin.config.urls, app.$router);
    };
}
//# sourceMappingURL=websocket-sandbox.js.map