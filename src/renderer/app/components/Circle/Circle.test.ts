import { shallowMount } from "@vue/test-utils";

import XCircle from "@/app/components/Circle/Circle.vue";

describe("Circle", () => {
	it("should render", () => {
		const wrapper = shallowMount(XCircle);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render slot", () => {
		const wrapper = shallowMount(XCircle, {
			propsData: {
				avatarId: "Sample avatar id",
			},
			slots: {
				default: ['<div class="slot-content">Slot content</div>'],
			},
		});

		const slot = wrapper.find(".slot-content");
		expect(slot.text()).toBe("Slot content");
	});

	it("should render in avatar style", () => {
		const wrapper = shallowMount(XCircle, {
			propsData: {
				avatarId: "Sample avatar id",
			},
		});
		expect(wrapper.element.style.backgroundColor).not.toBe("white");
	});
});
