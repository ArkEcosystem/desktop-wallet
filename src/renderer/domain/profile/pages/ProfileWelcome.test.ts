import { shallowMount } from "@vue/test-utils";

import ProfileWelcome from "@/domain/profile/pages/ProfileWelcome.vue";

describe("ProfileWelcome", () => {
	it("should render", () => {
		const wrapper = shallowMount(ProfileWelcome);

		expect(wrapper.text()).toContain("Select Profile");
		expect(wrapper.text()).toContain("Sign in to MarketSquare");
		expect(wrapper.text()).toContain("Create Profile");
	});
});
