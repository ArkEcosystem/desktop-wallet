import { shallowMount } from "@vue/test-utils";

import WalletMnemonicList from "@/domain/wallet/components/WalletMnemonicList.vue";

describe("WalletMnemonicList", () => {
	const mnemonic = ["lorem", "ipsum", "dolor", "sit", "amet"];

	it("should contain mnemonic words", () => {
		const wrapper = shallowMount(WalletMnemonicList, { propsData: { mnemonic } });
		const words = wrapper.findAll("[data-testid='WalletMnemonicList__item']");
		expect(words.length).toEqual(mnemonic.length);
		expect(words.wrappers[0].text()).toContain(mnemonic[0]);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
