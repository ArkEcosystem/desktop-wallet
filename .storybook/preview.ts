import { configure, addParameters } from "@storybook/vue";

import "reflect-metadata";
import "../src/renderer/app/styles/style.css";

addParameters({
	options: {
		showRoots: true,
	},
});

configure(require.context("../src", true, /\.stories\.ts$/), module);
