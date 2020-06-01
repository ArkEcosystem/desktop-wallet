import { shallowMount } from "@vue/test-utils";

import Splashscreen from "@/app/Splashscreen.vue";

describe("Splashscreen", () => {
	it("should render", () => {
		const wrapper = shallowMount(Splashscreen, { mocks: { $t: (input) => input } });

		expect(wrapper.html()).toMatchSnapshot();
	});
});
