import { shallowMount, mount } from "@vue/test-utils";

import WalletCard from "@/app/components/WalletCard/WalletCard.vue";

describe("WalletCardBlank", () => {
	it("should render", () => {
		const wrapper = shallowMount(WalletCard);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should have blank class names", () => {
		const wrapper = shallowMount(WalletCard, {
			propsData: {
				isBlank: true,
			},
		});

		expect(wrapper.find(".WalletCard--blank").exists()).toBe(true);
	});

	it("should render placeholders", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				isBlank: true,
			},
		});

		expect(wrapper.findAll(".Circle").length).toBe(2);
		expect(wrapper.findAll(".WalletCard__address").length).toBe(1);
		expect(wrapper.findAll(".WalletCard__balance").length).toBe(1);
	});

	it("should have correct placeholder texts", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				isBlank: true,
				blankAddressLabel: "Create wallet",
				blankBalanceLabel: "Balance",
			},
		});

		expect(wrapper.find(".WalletCard__address").text()).toBe("Create wallet");
		expect(wrapper.find(".WalletCard__balance").text()).toBe("Balance");
	});

	it("should have `truncateStringMiddle` method", () => {
		const wrapper = shallowMount(WalletCard, {
			propsData: {
				isBlank: true,
			},
		});

		expect(wrapper.vm.truncateStringMiddle).toBeFunction();
	});
});

describe("WalletCardFilled", () => {
	it("should render", () => {
		const wrapper = shallowMount(WalletCard);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should render avatar", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});

		expect(wrapper.find(".Circle.is-avatar").exists()).toBe(true);
	});

	it("should render coin icon", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});

		expect(wrapper.findAll(".Circle").length).toBe(2);
		expect(wrapper.find(".Circle:not(.is-avatar)").exists()).toBe(true);
	});

	it("should have render options dropdown", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});
		expect(wrapper.find(".Dropdown").exists()).toBe(true);
	});

	it("should not render dropdown menu if options not provided", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});
		expect(wrapper.find(".Dropdown").exists()).toBe(false);
	});

	it("should render wallet name", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});
		expect(wrapper.find(".WalletCard__address").text()).toContain("Satoshi");
	});

	it("should have `truncateStringMiddle` method", () => {
		const wrapper = shallowMount(WalletCard, {
			propsData: {},
		});

		expect(wrapper.vm.truncateStringMiddle).toBeFunction();
	});

	it("should render and truncate wallet address", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});
		expect(wrapper.find(".WalletCard__address").text()).toContain("Fa5eDS...aS3FJD");
	});

	it("should render balance", () => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});
		expect(wrapper.find(".WalletCard__balance ").text()).toContain("100,000,000");
		expect(wrapper.find(".WalletCard__balance ").text()).toContain("BTC");
	});

	it("should emit action event on dropdown selection", async (done) => {
		const wrapper = mount(WalletCard, {
			propsData: {
				options: ["Option 1", "Option 2", "Option 3"],
				data: {
					avatarId: "test",
					coinIcon: "₿",
					iconColor: "yellow-200",
					walletName: "Satoshi",
					address: "Fa5eDSFDSF8DFaS3FJD",
					balance: "100,000,000",
					symbol: "BTC",
				},
			},
		});

		wrapper.find(".Dropdown__toggle").trigger("click");
		await wrapper.vm.$nextTick();

		wrapper.find(".Dropdown__content a:first-child").trigger("click");
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted().action).toBeTruthy();

		done();
	});
});
