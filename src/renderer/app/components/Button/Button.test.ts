import { shallowMount } from "@vue/test-utils";

import XButton from "@/app/components/Button/Button.vue";

describe("Button", () => {
	it("should render", () => {
		const wrapper = shallowMount(XButton);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render if disabled", () => {
		const wrapper = shallowMount(XButton, { attrs: { disabled: "true" } });
		expect((wrapper.element as HTMLButtonElement).disabled).toBeTruthy();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should emit event on click", () => {
		const wrapper = shallowMount(XButton);
		wrapper.trigger("click");
		expect(wrapper.emitted()).not.toBeUndefined();
	});
});
