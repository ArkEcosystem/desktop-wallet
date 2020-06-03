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
