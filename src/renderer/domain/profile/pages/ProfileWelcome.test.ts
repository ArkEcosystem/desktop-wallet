import { createLocalVue, shallowMount } from "@vue/test-utils";

import ProfileWelcome from "@/domain/profile/pages/ProfileWelcome.vue";

const router = { push: jest.fn() };

const createStubbedVue = () => {
	return {
		localVue: createLocalVue(),
		mocks: {
			loadImageFromAssets: jest.fn(),
			$profiles: {
				all() {
					return {};
				},
			},
			$router: router,
		},
		stubs: {
			XButton: true,
			Toggle: true,
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

	it("should go to profile creation page", () => {
		const wrapper = shallowMount(ProfileWelcome, createStubbedVue());

		// @ts-ignore
		wrapper.vm.createProfile();

		expect(router.push).toHaveBeenCalledWith({ name: "profiles.create" });
	});
});
