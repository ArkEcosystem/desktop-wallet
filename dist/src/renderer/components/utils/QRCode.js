import QRious from 'qrious';
export default {
    props: {
        value: {
            type: String,
            required: true
        },
        options: {
            type: Object
        }
    },
    watch: {
        value: function () {
            this.generate();
        },
        options: function () {
            this.generate();
        }
    },
    mounted: function () {
        this.generate();
    },
    render: function (h) {
        return h('canvas', this.$slots.default);
    },
    methods: {
        generate: function () {
            var qr = new QRious(Object.assign({
                element: this.$el,
                value: this.value
            }, this.options));
            return qr;
        }
    }
};
//# sourceMappingURL=QRCode.js.map