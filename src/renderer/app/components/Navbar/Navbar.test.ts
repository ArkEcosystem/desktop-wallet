import { createLocalVue, shallowMount } from "@vue/test-utils";

import Navbar from "@/app/components/Navbar/Navbar.vue";

const createStubbedVue = () => {
  return {
    localVue: createLocalVue(),
    mocks: {
      assets_loadImage: jest.fn(),
    },
  };
};

describe("Navbar", () => {
	it("should render", () => {
		const wrapper = shallowMount(Navbar, createStubbedVue());

		expect(wrapper.html()).toMatchSnapshot();
	});
});
