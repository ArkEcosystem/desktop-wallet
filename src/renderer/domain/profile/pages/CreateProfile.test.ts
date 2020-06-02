import { Enums } from "@arkecosystem/platform-sdk-profiles";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { ValidationObserver, ValidationProvider } from "vee-validate/dist/vee-validate.full";

import CreateProfile from "@/domain/profile/pages/CreateProfile.vue";

const profileSettings = { set: jest.fn() };
const router = { push: jest.fn() };

const createStubbedVue = () => {
	const localVue = createLocalVue();
	localVue.component("ValidationObserver", ValidationObserver);
	localVue.component("ValidationProvider", ValidationProvider);

	return {
		localVue,
		mocks: {
			loadImageFromAssets: jest.fn(),
			$profiles: {
				push() {
					return { settings: jest.fn(() => profileSettings) };
				},
			},
			$router: router,
		},
		stubs: {
			FormError: true,
			ListDivided: true,
			ListDividedItem: true,
			SvgIcon: true,
			Toggle: true,
			XButton: true,
		},
		sync: false,
	};
};

describe("CreateProfile", () => {
	describe.each([true, false])(".darkTheme(%s)", (darkModeEnabled) => {
		beforeEach(() => {
			// @ts-ignore
			global.window.matchMedia = jest.fn(() => ({
				matches: darkModeEnabled,
				addListener: jest.fn(),
				removeListener: jest.fn(),
			}));
		});

		it("should render", () => {
			const wrapper = mount(CreateProfile, createStubbedVue());

			expect(wrapper.text()).toContain("Create Profile");
			expect(wrapper.html()).toMatchSnapshot();
		});

		it("should submit the form and create a profile without any errors", async () => {
			const wrapper = mount(CreateProfile, createStubbedVue());

			expect(wrapper.vm.$data).toEqual({
				form: {
					name: "",
					marketProvider: "coingecko",
					currency: "btc",
					darkTheme: darkModeEnabled,
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
					darkTheme: darkModeEnabled,
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
			expect(profileSettings.set).toHaveBeenNthCalledWith(
				3,
				Enums.ProfileSetting.Theme,
				darkModeEnabled ? "dark" : "light",
			);

			jest.clearAllMocks();
		});

		it("should go back to the welcome page", () => {
			const wrapper = shallowMount(CreateProfile, createStubbedVue());

			wrapper.setData({
				form: {
					name: "John Doe",
					marketProvider: "coincap",
					currency: "eth",
					darkTheme: false,
				},
			});

			expect(wrapper.vm.$data).toEqual({
				form: {
					name: "John Doe",
					marketProvider: "coincap",
					currency: "eth",
					darkTheme: false,
				},
			});

			// @ts-ignore
			wrapper.vm.backToWelcome();

			expect(wrapper.vm.$data).toEqual({
				form: {
					name: "",
					marketProvider: "coingecko",
					currency: "btc",
					darkTheme: false,
				},
			});

			expect(router.push).toHaveBeenCalledWith({ name: "profiles.welcome" });
		});
	});
});
