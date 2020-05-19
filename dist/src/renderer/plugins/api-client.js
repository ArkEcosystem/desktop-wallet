import Client from '@/services/client';
export var client = new Client();
export default {
    install: function (Vue) {
        Vue.prototype.$client = client;
    }
};
//# sourceMappingURL=api-client.js.map