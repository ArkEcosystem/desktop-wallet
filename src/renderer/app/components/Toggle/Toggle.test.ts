import { shallowMount } from "@vue/test-utils";

import Toggle from "@/app/components/Toggle/Toggle.vue";

describe("Toggle", () => {
	it("should render", () => {
		const wrapper = shallowMount(Toggle);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should toggle on click", () => {
		const wrapper = shallowMount(Toggle);
		wrapper.trigger("click");
		wrapper.trigger("click");
		expect(wrapper.emitted().change).toEqual([[true], [false]]);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should be disabled", () => {
		const wrapper = shallowMount(Toggle, {
			propsData: {
				disabled: true,
			},
		});
		wrapper.trigger("click");
		expect(wrapper.emitted().change).toBeUndefined();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should toggle by prop", async () => {
		const wrapper = shallowMount(Toggle, {
			propsData: {
				checked: true,
			},
		});
		expect(wrapper.find("input:checked").exists()).toBeTruthy();
		wrapper.setProps({ checked: false });
		await wrapper.vm.$nextTick();
		expect(wrapper.find("input:checked").exists()).toBeFalsy();
		expect(wrapper.html()).toMatchSnapshot();
	});
});
