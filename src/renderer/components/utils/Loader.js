import { PulseLoader } from "vue-spinner/dist/vue-spinner.min";

const tailwindConfig = require("@tailwind");

export default {
	functional: true,

	props: {
		color: {
			type: String,
			required: false,
			default: tailwindConfig.theme.colors["blue-dark"],
		},
	},

	render: (h, ctx) =>
		h(PulseLoader, {
			props: {
				color: ctx.props.color,
			},
		}),
};
