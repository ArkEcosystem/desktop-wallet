export default (function (store) {
    store._IS_READY = false;
    store.subscribe(function (mutation) {
        if (mutation.type === 'RESTORE_MUTATION') {
            store._vm.$root.$emit('vuex-persist:ready');
            store._IS_READY = true;
        }
    });
});
//# sourceMappingURL=vuex-persist-ready.js.map