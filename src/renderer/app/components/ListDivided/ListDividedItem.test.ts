import { shallowMount } from "@vue/test-utils";

import ListDividedItem from "@/app/components/ListDivided/ListDividedItem.vue";

describe("ListDividedItem", () => {
	it("should render", () => {
		const wrapper = shallowMount(ListDividedItem, {
			propsData: { label: "Item" },
		});

		expect(wrapper.html()).toMatchSnapshot();
	});

  it("should show the label", () => {
    const label = "Item";
    const wrapper = shallowMount(ListDividedItem, {
      propsData: {
        label,
      },
    });
    const div = wrapper.find(".ListDividedItem__label");

    expect(div.text()).toBe(label);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should show the label description", () => {
    const description = "Lorem ipsum dolor sit amet";
    const wrapper = shallowMount(ListDividedItem, {
      propsData: {
        label: "test",
        labelDescription: description,
      },
    });
    const div = wrapper.find(".ListDividedItem__label__description");

    expect(div.text()).toBe(description);
    expect(wrapper.html()).toMatchSnapshot();
  });

    it("should accept default slot", () => {
      const wrapper = shallowMount(ListDividedItem, {
        propsData: {
          label: "test",
        },
        slots: {
          default: "<strong>test</strong>",
        },
      });
      const div = wrapper.find(".ListDividedItem__value");

      expect(div.find("strong").text()).toBe("test");
      expect(wrapper.html()).toMatchSnapshot();
    });
});
