import { mount } from "@vue/test-utils";

import Toggle from "@/app/Toggle/Toggle.vue";

describe("Alert", () => {
	it("should render", () => {
		const wrapper = mount(Toggle);
		expect(wrapper.isVueInstance()).toBeTruthy();
	});

	it("should toggle on click", () => {
		const wrapper = mount(Toggle);
		wrapper.trigger('click');
		wrapper.trigger('click');
		expect(wrapper.emitted().change[0]).toEqual([true]);
		expect(wrapper.emitted().change[1]).toEqual([false]);
	});

	it("should be disabled", () => {
		const wrapper = mount(Toggle, {
			propsData: {
				disabled: true
			}
		});
		wrapper.trigger('click');
		expect(wrapper.emitted().change).toBeUndefined();
	});

	it("should toggle on click", () => {
		const wrapper = mount(Toggle);
		wrapper.trigger('click');
		wrapper.trigger('click');
		expect(wrapper.emitted().change[0]).toEqual([true]);
		expect(wrapper.emitted().change[1]).toEqual([false]);
	});

	it("should toggle by prop", () => {
		const wrapper = mount(Toggle, {
			propsData: {
				checked: true
			}
		});
		expect(wrapper.find("input:checked").exists()).toBeTruthy();
		wrapper.setProps({ checked: false });
		expect(wrapper.find("input:checked").exists()).toBeFalsy();
	});
});
