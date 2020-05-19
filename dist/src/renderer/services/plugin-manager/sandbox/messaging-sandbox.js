import { cloneDeep } from 'lodash';
export function create(walletApi, app) {
    return function () {
        var messages = {
            events: {},
            clear: function () {
                for (var eventId in this.events) {
                    window.removeEventListener('message', this.events[eventId]);
                }
                this.events = {};
            },
            on: function (action, eventCallback) {
                var eventTrigger = function (event) {
                    if (event.data !== Object(event.data) || event.data.action !== action) {
                        return;
                    }
                    eventCallback(cloneDeep(event.data));
                };
                window.addEventListener('message', eventTrigger);
                this.events[action] = eventTrigger;
            }
        };
        app.$router.beforeEach(function (_, __, next) {
            messages.clear();
            next();
        });
        walletApi.messages = messages;
    };
}
//# sourceMappingURL=messaging-sandbox.js.map