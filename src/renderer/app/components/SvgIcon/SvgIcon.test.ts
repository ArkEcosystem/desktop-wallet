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
});
