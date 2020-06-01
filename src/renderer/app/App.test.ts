import { createLocalVue, shallowMount } from "@vue/test-utils";

import App from "@/app/App.vue";

const createStubbedVue = () => ({
	localVue: createLocalVue(),
	stubs: ["router-link", "router-view"],
});

describe("App", () => {
	it("should render", () => {
		const wrapper = shallowMount(App, createStubbedVue());

		expect(wrapper.html()).toMatchSnapshot();
	});
});
