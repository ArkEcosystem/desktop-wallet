import { shallowMount } from "@vue/test-utils";

import ProfileNew from "@/domain/profile/pages/ProfileNew.vue";

describe("ProfileNew", () => {
	it("should render", () => {
		const wrapper = shallowMount(ProfileNew);

		expect(wrapper.text()).toContain("Create Profile");
	});
});
