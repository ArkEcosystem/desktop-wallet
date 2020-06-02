import { shallowMount } from "@vue/test-utils";

import SvgIcon from "@/app/components/SvgIcon/SvgIcon.vue";

describe("SvgIcon", () => {
	it("should render", () => {
		const wrapper = shallowMount(SvgIcon, {
			propsData: {
				name: "test",
			},
		});

		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render with a viewBox", () => {
		const wrapper = shallowMount(SvgIcon, {
			propsData: {
				name: "test",
				viewBox: "0 0 50 50",
			},
		});

		expect(wrapper.html()).toMatchSnapshot();
	});
});
