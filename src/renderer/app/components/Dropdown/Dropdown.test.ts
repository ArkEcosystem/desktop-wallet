import { shallowMount, mount } from "@vue/test-utils";

import Dropdown from "@/app/components/Dropdown/Dropdown.vue";

describe("Dropdown", () => {
	it("should render", () => {
		const wrapper = shallowMount(Dropdown);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should be closed on initial render", () => {
		const wrapper = mount(Dropdown, {
			propsData: {
				options: ["Contacts", "Settings", "Support", "Exit"],
			},
		});

		expect(wrapper.vm.isOpen).toBe(false);
	});

	it("should render custom optional toggle html slot", () => {
		const wrapper = shallowMount(Dropdown, {
			slots: {
				toggle: ["<div>Custom toggle html</div>"],
			},
		});

		expect(wrapper.find(".Dropdown__toggle").text()).toContain("Custom toggle html");
	});

	it("should open dropdown content on toggle click", () => {
		const wrapper = mount(Dropdown, {
			propsData: {
				options: ["Contacts", "Settings", "Support", "Exit"],
			},
		});

		wrapper.find(".Dropdown__toggle").trigger("click");
		expect(wrapper.vm.isOpen).toBe(true);
	});

	it("should render prop options", async (done) => {
		const wrapper = shallowMount(Dropdown, {
			propsData: {
				options: ["Contacts", "Settings", "Support", "Exit"],
			},
		});

		wrapper.find(".Dropdown__toggle").trigger("click");

		await wrapper.vm.$nextTick();
		expect(wrapper.find(".Dropdown__content").text()).toContain("Contact");
		expect(wrapper.find(".Dropdown__content").text()).toContain("Settings");
		expect(wrapper.find(".Dropdown__content").text()).toContain("Support");
		expect(wrapper.find(".Dropdown__content").text()).toContain("Exit");
		done();
	});

	it("should render custom optional dropdown content slot", async (done) => {
		const wrapper = shallowMount(Dropdown, {
			slots: {
				default: ["Custom dropdown content"],
			},
		});

		wrapper.find(".Dropdown__toggle").trigger("click");

		await wrapper.vm.$nextTick();
		expect(wrapper.find(".Dropdown__content").text()).toContain("Custom dropdown content");
		done();
	});

	it("should emit select event on selection", async (done) => {
		const wrapper = mount(Dropdown, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"]
			},
		});

		wrapper.find(".Dropdown__toggle").trigger("click");
		await wrapper.vm.$nextTick();

		wrapper.find(".Dropdown__content a:first-child").trigger("click");
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted().select).toBeTruthy();

		done();
	});
});
