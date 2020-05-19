import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min';
import tailwindConfig from '@tailwind';
export default {
    functional: true,
    props: {
        color: {
            type: String,
            required: false,
            default: tailwindConfig.colors['blue-dark']
        }
    },
    render: function (h, ctx) { return h(PulseLoader, {
        props: {
            color: ctx.props.color
        }
    }); }
};
//# sourceMappingURL=Loader.js.map