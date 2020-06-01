import { Enums } from "@arkecosystem/platform-sdk-profiles";
import { createLocalVue, mount } from "@vue/test-utils";
import * as flushPromises from "flush-promises";
import { ValidationObserver, ValidationProvider } from "vee-validate/dist/vee-validate.full";

import ProfileNew from "@/domain/profile/pages/ProfileNew.vue";

const profileSettings = { set: jest.fn() };

const createStubbedVue = () => {
	const localVue = createLocalVue();
	localVue.component("ValidationObserver", ValidationObserver);
	localVue.component("ValidationProvider", ValidationProvider);

	return {
		localVue,
		mocks: {
			$profiles: {
				push() {
					return { settings: jest.fn(() => profileSettings) };
				},
			},
		},
		stubs: {
			XButton: true,
			Toggle: true,
			FormError: true,
			ListDivided: true,
			ListDividedItem: true,
		},
		sync: false,
	};
};

describe("ProfileNew", () => {
	it("should render", () => {
		const wrapper = mount(ProfileNew, createStubbedVue());

		expect(wrapper.text()).toContain("Create Profile");
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should submit the form and create a profile without any errors", async () => {
		const wrapper = mount(ProfileNew, createStubbedVue());

		expect(wrapper.vm.$data).toEqual({
			form: {
				name: "",
				marketProvider: "coingecko",
				currency: "btc",
				darkTheme: false,
			},
		});

		wrapper.find("input[name='name']").setValue("John Doe");
		wrapper.find("select[name='market_provider']").setValue("coincap");
		wrapper.find("select[name='currency']").setValue("eth");
		// wrapper.find("[name='dark_theme']").setValue(true);

		expect(wrapper.vm.$data).toEqual({
			form: {
				name: "John Doe",
				marketProvider: "coincap",
				currency: "eth",
				darkTheme: false,
			},
		});

		wrapper.find("form").trigger("submit.prevent");

		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.vm.$data).toEqual({
			form: {
				name: "",
				marketProvider: "coingecko",
				currency: "btc",
				darkTheme: false,
			},
		});

		expect(profileSettings.set).toHaveBeenNthCalledWith(1, Enums.ProfileSetting.MarketProvider, "coincap");
		expect(profileSettings.set).toHaveBeenNthCalledWith(2, Enums.ProfileSetting.ChartCurrency, "eth");
		expect(profileSettings.set).toHaveBeenNthCalledWith(3, Enums.ProfileSetting.Theme, "light");
	});
});
