import { mount } from '@vue/test-utils';

import Alert from "@/app/Alert/Alert.vue";

describe("Alert", () => {
	it("should render", () => {
		const wrapper = mount(Alert);
		expect(wrapper.isVueInstance()).toBeTruthy();
	});

	it("should render with title", () => {
		const wrapper = mount(Alert, {
			propsData: {
				title: 'Test'
			}
		});
		const title = wrapper.find(`[data-testid="Alert__title"]`);
		expect(title.text()).toBe("Test");
	});
});
