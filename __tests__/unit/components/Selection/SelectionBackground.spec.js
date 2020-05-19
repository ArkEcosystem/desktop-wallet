import { shallowMount } from "@vue/test-utils";

import { SelectionBackground } from "@/components/Selection";
import StringsMixin from "@/mixins/strings";

import { useI18nGlobally } from "../../__utils__/i18n";

const i18n = useI18nGlobally();

describe("SelectionBackground", () => {
	describe("SelectionBackground", () => {
		it("should render the component", () => {
			const wrapper = shallowMount(SelectionBackground, {
				i18n,
				mixins: [StringsMixin],
			});

			expect(wrapper.contains(".SelectionBackgroundGrid")).toBeTruthy();
		});
	});
});
