import TestUtils from "@vue/test-utils";
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

TestUtils.config.mocks.$eventBus = eventBus;
TestUtils.config.mocks.$client = {
	fetchDelegates: jest.fn(),
};

TestUtils.config.mocks.assets_loadImage = jest.fn();
TestUtils.config.mocks.collections_filterChildren = jest.fn();
TestUtils.config.mocks.currency_format = jest.fn();
TestUtils.config.mocks.currency_subToUnit = jest.fn();
TestUtils.config.mocks.electron_openExternal = jest.fn();
TestUtils.config.mocks.session_network = jest.fn();
TestUtils.config.mocks.session_profile = jest.fn();
TestUtils.config.mocks.wallet_fromRoute = {};
