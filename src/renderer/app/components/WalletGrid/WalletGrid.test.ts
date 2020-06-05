import { shallowMount, mount } from "@vue/test-utils";

import Slider from "@/app/components/Slider/Slider.vue";

describe("Slider", () => {
	it("should render", () => {
		const wrapper = shallowMount(Slider);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Should render slot components", () => {
		const wrapper = shallowMount(Slider, {
			propsData: {
				items: "[1, 2, 3, 4]",
			},
			slots: {
				item: '<template><div class="slide-item">Slide content</div></template>',
			},
		});

		const slot = wrapper.find(".slide-item");
		expect(slot.text()).toBe("Slide content");
	});
});
