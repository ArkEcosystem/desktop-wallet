import "jest-extended";

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

	it("should toggle when the user clicks", async () => {
		const wrapper = shallowMount(ButtonSwitch);

		// @ts-ignore
		expect(wrapper.vm.model).toBeFalse();

		// @ts-ignore
		await wrapper.trigger("click");

		// @ts-ignore
		expect(wrapper.vm.model).toBeTrue();
		expect(wrapper.emitted("change")).toBeTruthy();
	});

	it("should toggle by method call", () => {
		const wrapper = shallowMount(ButtonSwitch);

		// @ts-ignore
		expect(wrapper.vm.model).toBeFalse();

		// @ts-ignore
		wrapper.vm.toggle();

		// @ts-ignore
		expect(wrapper.vm.model).toBeTrue();
		expect(wrapper.emitted("change")).toBeTruthy();
	});

	it("should not toggle the active state if the component is disabled", () => {
		const wrapper = shallowMount(ButtonSwitch, { propsData: { isDisabled: true } });

		// @ts-ignore
		expect(wrapper.vm.model).toBeFalse();

		// @ts-ignore
		wrapper.vm.toggle();

		// @ts-ignore
		expect(wrapper.vm.model).toBeFalse();
		expect(wrapper.emitted("change")).toBeUndefined();
	});
});
