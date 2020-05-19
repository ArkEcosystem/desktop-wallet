import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuelidate from "vuelidate";

import { ModalAdditionalLedgers } from "@/components/Modal";

import useI18nGlobally from "../../__utils__/i18n";

Vue.use(Vuelidate);

const i18n = useI18nGlobally();
let wrapper;
beforeEach(() => {
	wrapper = shallowMount(ModalAdditionalLedgers, {
		i18n,
		mocks: {
			$store: {
				getters: {
					"ledger/wallets"() {
						return [];
					},
				},
			},
		},
	});
});

describe("ModalAdditionalLedgers", () => {
	it("should render modal", () => {
		expect(wrapper.isVueInstance()).toBeTrue();
	});
});
