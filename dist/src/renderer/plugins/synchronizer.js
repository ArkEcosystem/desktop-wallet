import Synchronizer from '@/services/synchronizer';
export default {
    install: function (Vue) {
        var synchronizer;
        Object.defineProperty(Vue.prototype, '$synchronizer', {
            get: function () {
                if (!synchronizer) {
                    synchronizer = new Synchronizer({ scope: this });
                }
                return synchronizer;
            }
        });
    }
};
//# sourceMappingURL=synchronizer.js.map