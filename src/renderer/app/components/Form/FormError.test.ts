import { shallowMount } from "@vue/test-utils";

import FormError from "@/app/components/Form/FormError.vue";

describe("FormError", () => {
	it("should render with errors", () => {
		const wrapper = shallowMount(FormError, {
			propsData: {
				errors: ["Error 0", "Error 1"],
			},
		});

		expect(wrapper.element.innerHTML).toContain("Error 0");
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should not render without errors", () => {
		const wrapper = shallowMount(FormError);

		expect(wrapper.element.innerHTML).toBeUndefined();
		expect(wrapper.html()).toMatchSnapshot();
	});
});
