import { createLocalVue, shallowMount } from "@vue/test-utils";

import ProfileWelcome from "@/domain/profile/pages/ProfileWelcome.vue";

const createStubbedVue = () => {
	return {
		localVue: createLocalVue(),
		mocks: {
			$profiles: {
				all() {
					return {};
				},
			},
		},
		stubs: {
			ProfileWelcome: true,
		},
		sync: false,
	};
};

describe("ProfileWelcome", () => {
	it("should render without profiles", () => {
		const wrapper = shallowMount(ProfileWelcome, createStubbedVue());

		expect(wrapper.text()).toContain("Sign in to MarketSquare");
		expect(wrapper.text()).toContain("Create Profile");
		expect(wrapper.html()).toMatchSnapshot();
	});
});
