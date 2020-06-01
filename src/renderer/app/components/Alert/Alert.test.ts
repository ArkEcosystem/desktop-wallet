import { shallowMount } from "@vue/test-utils";

import Alert from "@/app/components/Alert/Alert.vue";

describe("Alert", () => {
	it("should render", () => {
		const wrapper = shallowMount(Alert);
		expect(wrapper.find(".Alert")).toBeTruthy();
	});

	it("should render with title", () => {
		const wrapper = shallowMount(Alert, {
			propsData: {
				title: "Test",
			},
		});
		const title = wrapper.find(`[data-testid="Alert__title"]`);
		expect(title.text()).toBe("Test");
	});
});
