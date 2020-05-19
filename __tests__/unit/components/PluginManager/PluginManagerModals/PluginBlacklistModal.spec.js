import { mount } from "@vue/test-utils";

import { PluginBlacklistModal } from "@/components/PluginManager/PluginManagerModals";

import useI18nGlobally from "../../../__utils__/i18n";

const i18n = useI18nGlobally();

let wrapper;

beforeEach(() => {
	wrapper = mount(PluginBlacklistModal, {
		i18n,
		propsData: {
			plugin: {
				id: "test",
				version: "0.0.1",
			},
		},
		stubs: {
			Portal: true,
		},
	});
});

describe("PluginBlacklistModal", () => {
	it("should render", () => {
		expect(wrapper.isVueInstance()).toBeTrue();
	});

	describe("Methods", () => {
		it("should emit cancel event", () => {
			wrapper.vm.emitCancel();
			expect(wrapper.emitted("cancel")).toBeTruthy();
		});

		it("should emit confirm event", () => {
			wrapper.vm.emitConfirm();
			expect(wrapper.emitted("confirm")).toBeTruthy();
		});
	});
});
