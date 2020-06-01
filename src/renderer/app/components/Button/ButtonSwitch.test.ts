import { shallowMount } from "@vue/test-utils";

import ButtonSwitch from "@/app/components/Button/ButtonSwitch.vue";

describe("ButtonSwitch", () => {
	it("should render", () => {
		const wrapper = shallowMount(ButtonSwitch);

		expect(wrapper.html()).not.toContain("ButtonSwitch--active");
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render if active", () => {
		const wrapper = shallowMount(ButtonSwitch, { propsData: { isActive: true } });

		expect(wrapper.html()).toContain("ButtonSwitch--active");
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render if disabled", () => {
		const wrapper = shallowMount(ButtonSwitch, { propsData: { isDisabled: true } });

		expect(wrapper.html()).not.toContain("ButtonSwitch--active");
		expect(wrapper.html()).toMatchSnapshot();
	});
});
