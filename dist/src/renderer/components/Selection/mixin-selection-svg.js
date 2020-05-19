export default {
    data: function () { return ({
        selectedItemId: null
    }); },
    computed: {
        selectedItem: {
            get: function () {
                var _this = this;
                if (this.selectedItemId) {
                    return this.images.find(function (image) { return image.id === _this.selectedItemId; });
                }
                return this.images.find(function (image) { return image.id === _this.selected; });
            },
            set: function (_a) {
                var id = _a.id;
                this.selectedItemId = id;
            }
        }
    },
    methods: {
        select: function (item) {
            this.selectedItem = item;
            this.$emit('select', item.id);
        }
    }
};
//# sourceMappingURL=mixin-selection-svg.js.map