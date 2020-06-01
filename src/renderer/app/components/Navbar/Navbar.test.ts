import { shallowMount } from "@vue/test-utils";

import Navbar from "@/app/components/Navbar/Navbar.vue";

describe("Navbar", () => {
	it("should render", () => {
		const wrapper = shallowMount(Navbar);

		expect(wrapper.html()).toMatchSnapshot();
	});
});
