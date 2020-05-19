export default {
    methods: {
        /**
         * Open the explorer from current network.
         *
         * @param {String} path
         * @param {String} param
         */
        network_openExplorer: function (path, param) {
            var network = this.session_network;
            if (!network) {
                throw new Error('[network_openExplorer] No active network.');
            }
            var explorer = network.explorer;
            var uri = explorer + "/" + path + "/" + param;
            this.electron_openExternal(uri);
        }
    }
};
//# sourceMappingURL=network.js.map