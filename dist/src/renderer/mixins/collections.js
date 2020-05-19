export default {
    methods: {
        collections_filterChildren: function (childName, ref) {
            if (ref === void 0) { ref = this; }
            ref = ref.$children.find(function (child) {
                return child.$options._componentTag === 'TransitionGroup';
            }) || ref;
            return ref.$children.filter(function (child) {
                return child.$options.name === childName;
            });
        }
    }
};
//# sourceMappingURL=collections.js.map