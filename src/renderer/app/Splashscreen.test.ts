import { shallowMount } from "@vue/test-utils";

import SplashScreen from "@/app/SplashScreen.vue";

describe("SplashScreen", () => {
	it("should render", () => {
		const wrapper = shallowMount(SplashScreen, { mocks: { $t: (input) => input } });

		expect(wrapper.html()).toMatchSnapshot();
	});
});
