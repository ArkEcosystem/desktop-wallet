import Chart from "chart.js";
import resolveConfig from "tailwindcss/resolveConfig";
import { Line, mixins } from "vue-chartjs";

const tailwindConfig = require("@tailwind");
const tailwindFullConfig = resolveConfig(tailwindConfig);

Chart.defaults.global.defaultFontFamily = tailwindFullConfig.theme.fontFamily.sans.join(",");
// TODO: Add theme colors

export default {
	extends: Line,

	mixins: [mixins.reactiveProp],

	props: {
		chartData: {
			type: Object,
			required: true,
		},
		options: {
			type: Object,
			required: true,
		},
	},

	mounted() {
		this.$on("chart:render", () => {
			this.$emit("ready");
		});
		this.render();
	},

	watch: {
		options() {
			this.destroy();
			this.render();
		},
	},

	methods: {
		getCanvas() {
			return this.$refs.canvas;
		},

		destroy() {
			this.$data._chart.destroy();
		},

		render() {
			this.renderChart(this.chartData, this.options);
		},

		update() {
			this.$data._chart.update();
		},
	},
};
