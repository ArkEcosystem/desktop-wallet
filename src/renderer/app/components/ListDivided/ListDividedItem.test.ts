import { shallowMount } from "@vue/test-utils";

import ListDividedItem from "@/app/components/ListDivided/ListDividedItem.vue";

describe("ListDividedItem", () => {
	it("should render", () => {
		const wrapper = shallowMount(ListDividedItem, {
			propsData: { label: "Item" },
		});

		expect(wrapper.html()).toMatchSnapshot();
	});
});
