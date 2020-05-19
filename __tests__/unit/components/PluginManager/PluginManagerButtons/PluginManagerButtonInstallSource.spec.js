import { shallowMount } from "@vue/test-utils";

import { PluginManagerButtonInstallSource } from "@/components/PluginManager/PluginManagerButtons";

import useI18nGlobally from "../../../__utils__/i18n";

const i18n = useI18nGlobally();
let wrapper;

beforeEach(() => {
	wrapper = shallowMount(PluginManagerButtonInstallSource, {
		i18n,
		propsData: {
			source: "url",
		},
	});
});

describe("PluginManagerButtonInstallSource", () => {
	it("should render", () => {
		expect(wrapper.isVueInstance()).toBeTrue();
	});

	it("should emit click event", () => {
		wrapper.find(".PluginManagerButtonInstallSource").trigger("click");
		expect(wrapper.emitted("click")).toBeTruthy();
	});
});
