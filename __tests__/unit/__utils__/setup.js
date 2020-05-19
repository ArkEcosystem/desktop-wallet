import { config } from "@vue/test-utils";
import VTooltip from "v-tooltip";
import Vue from "vue";

import directives from "@/directives";
import filters from "@/filters";
import eventBus from "@/plugins/event-bus";

require("babel-plugin-require-context-hook/register")();

HTMLCanvasElement.prototype.getContext = jest.fn();

Vue.use(VTooltip, {
	defaultHtml: false,
	defaultContainer: "#app",
});
Vue.use(directives);
Vue.use(filters);
Vue.config.ignoredElements = ["webview"];

config.mocks.$eventBus = eventBus;
config.mocks.$client = {
	fetchDelegates: jest.fn(),
};

config.mocks.assets_loadImage = jest.fn();
config.mocks.collections_filterChildren = jest.fn();
config.mocks.currency_format = jest.fn();
config.mocks.currency_subToUnit = jest.fn();
config.mocks.electron_openExternal = jest.fn();
config.mocks.session_network = jest.fn();
config.mocks.session_profile = jest.fn();
config.mocks.wallet_fromRoute = {};
