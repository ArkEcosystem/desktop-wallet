import { shallowMount } from "@vue/test-utils";

import ListDivided from "@/app/components/ListDivided/ListDivided.vue";

describe("ListDivided", () => {
	it("should render", () => {
		const wrapper = shallowMount(ListDivided);

		expect(wrapper.html()).toMatchSnapshot();
	});
});
