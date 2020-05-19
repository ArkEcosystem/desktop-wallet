import { shallowMount } from "@vue/test-utils";

import { WalletRenameModal } from "@/components/Wallet";

import useI18nGlobally from "../../__utils__/i18n";

const i18n = useI18nGlobally();
let wrapper;
beforeEach(() => {
	wrapper = shallowMount(WalletRenameModal, {
		propsData: {
			wallet: {},
		},
		i18n,
	});
});
describe("WalletRenameModal", () => {
	it("should render modal", () => {
		expect(wrapper.isVueInstance()).toBeTrue();
	});
});
