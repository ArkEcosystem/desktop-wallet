export default {
    functional: true,
    props: {
        vnodes: {
            type: [Array, Object],
            required: true
        }
    },
    render: function (h, ctx) { return ctx.props.vnodes; }
};
//# sourceMappingURL=VNodes.js.map