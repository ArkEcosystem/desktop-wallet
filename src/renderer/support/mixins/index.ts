import { assetMixins } from "./assets";
import { stringsMixings } from "./strings";

export const mixins = {
	computed: {},
	methods: {
		...assetMixins.methods,
		...stringsMixings.methods,
	},
};
