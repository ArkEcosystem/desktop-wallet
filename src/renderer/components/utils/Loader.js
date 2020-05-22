import resolveConfig from "tailwindcss/resolveConfig";
import { PulseLoader } from "vue-spinner/dist/vue-spinner.min";

const tailwindConfig = require("@tailwind");
const tailwindFullConfig = resolveConfig(tailwindConfig);

export default {
	functional: true,

	props: {
		color: {
			type: String,
			required: false,
			default: tailwindFullConfig.theme.colors["blue-dark"],
		},
	},

	render: (h, ctx) =>
		h(PulseLoader, {
			props: {
				color: ctx.props.color,
			},
		}),
};
