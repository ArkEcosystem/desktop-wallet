import { Identities } from "@arkecosystem/crypto";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuelidate from "vuelidate";

import TransactionFormBridgechainResignation from "@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainResignation";
import CurrencyMixin from "@/mixins/currency";
import BigNumber from "@/plugins/bignumber";
import WalletService from "@/services/wallet";

import installI18n from "../../../../__utils__/i18n";

const localVue = createLocalVue();
localVue.use(Vuelidate);
const i18n = installI18n(localVue);

const network = {
	token: "ARK",
	version: 23,
	wif: 170,
	market: {
		enabled: false,
	},
};

let wrapper;
const createWrapper = (component, wallet, bridgechain) => {
	component = component || TransactionFormBridgechainResignation;
	wallet = wallet || {
		address: "address-1",
		passphrase: null,
	};

	if (bridgechain === undefined) {
		bridgechain = {
			isResigned: false,
			name: "bridgechain",
			seedNodes: ["1.1.1.1", "2.2.2.2"],
			ports: {
				"@arkecosystem/core-api": 4003,
			},
			genesisHash: "2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867",
			bridgechainRepository: "https://github.com/arkecosystem/core.git",
		};
	}

	wrapper = mount(component, {
		i18n,
		localVue,
		sync: false,
		propsData: {
			bridgechain,
		},
		mocks: {
			$client: {
				buildBridgechainResignation: jest.fn((transactionData) => transactionData),
			},
			$error: jest.fn(),
			$store: {
				getters: {
					"transaction/staticFee": jest.fn(() => null),
					"session/lastFeeByType": jest.fn(() => (1 * 1e8).toString()),
					"session/network": network,
					"network/byToken": jest.fn(() => network),
				},
			},
			$synchronizer: {
				appendFocus: jest.fn(),
			},
			session_network: network,
			currency_format: jest.fn(CurrencyMixin.methods.currency_format),
			currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
			currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
			currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
			wallet_formatAddress: jest.fn((address) => `formatted-${address}`),
			wallet_fromRoute: wallet,
		},
		stubs: {
			Portal: true,
		},
	});
};

let spyCanResignBusiness;
describe("TransactionFormBridgechainResignation", () => {
	beforeEach(() => {
		spyCanResignBusiness = jest.spyOn(WalletService, "canResignBusiness").mockReturnValue(true);

		createWrapper();
	});

	afterEach(() => {
		spyCanResignBusiness.mockRestore();
	});

	it("should have magistrate transaction group", () => {
		expect(wrapper.vm.$options.transactionGroup).toBe(2);
	});

	it("should have business resignation transaction type", () => {
		expect(wrapper.vm.$options.transactionType).toBe(4);
	});

	describe("template", () => {
		it("should render", () => {
			expect(wrapper.contains(".TransactionFormBridgechainResignation")).toBe(true);
		});

		it("should have fee field", () => {
			expect(wrapper.contains(".TransactionFormBridgechainResignation__fee")).toBe(true);
		});

		describe("ledger notice", () => {
			it("should show if wallet is a ledger", () => {
				createWrapper(null, {
					isLedger: true,
				});

				expect(wrapper.contains(".TransactionFormBridgechainResignation__ledger-notice")).toBe(true);
			});

			it("should show if wallet is not a ledger", () => {
				createWrapper(null, {
					isLedger: false,
				});

				expect(wrapper.contains(".TransactionFormBridgechainResignation__ledger-notice")).toBe(false);
			});
		});

		describe("password field", () => {
			it("should show if wallet does have a password", () => {
				createWrapper(null, {
					passphrase: "password",
				});

				expect(wrapper.contains(".TransactionFormBridgechainResignation__password")).toBe(true);
			});

			it("should show if wallet does not have a password", () => {
				expect(wrapper.contains(".TransactionFormBridgechainResignation__password")).toBe(false);
			});
		});

		describe("passphrase field", () => {
			it("should show if wallet does not have a password", () => {
				expect(wrapper.contains(".TransactionFormBridgechainResignation__passphrase")).toBe(true);
			});

			it("should not show if wallet does have a password", () => {
				createWrapper(null, {
					passphrase: "password",
				});

				expect(wrapper.contains(".TransactionFormBridgechainResignation__passphrase")).toBe(false);
			});
		});

		describe("next button", () => {
			it("should be enabled if form is valid", async () => {
				wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
				wrapper.vm.$v.form.passphrase.$model = "passphrase";

				await wrapper.vm.$nextTick();

				expect(wrapper.find(".TransactionFormBridgechainResignation__next").attributes("disabled")).toBeFalsy();
			});

			it("should be disabled if form is invalid", async () => {
				wrapper.vm.$v.form.$touch();

				await wrapper.vm.$nextTick();

				expect(wrapper.find(".TransactionFormBridgechainResignation__next").attributes("disabled")).toBe(
					"disabled",
				);
			});
		});
	});

	describe("methods", () => {
		describe("getTransactionData", () => {
			it("should return correct data with passphrase", () => {
				wrapper.vm.$v.form.fee.$model = 0.1;
				wrapper.vm.$v.form.passphrase.$model = "passphrase";

				expect(wrapper.vm.getTransactionData()).toEqual({
					address: "address-1",
					passphrase: "passphrase",
					bridgechainId: "2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867",
					fee: new BigNumber(0.1 * 1e8),
					wif: undefined,
					networkWif: 170,
					multiSignature: undefined,
				});
			});

			it("should return correct data with passphrase and second passphrase", () => {
				createWrapper(null, {
					address: "address-1",
					passphrase: null,
					secondPublicKey: Identities.PublicKey.fromPassphrase("second passphrase"),
				});

				wrapper.vm.$v.form.fee.$model = 0.1;
				wrapper.vm.$v.form.passphrase.$model = "passphrase";
				wrapper.vm.$v.form.secondPassphrase.$model = "second passphrase";

				expect(wrapper.vm.getTransactionData()).toEqual({
					address: "address-1",
					passphrase: "passphrase",
					secondPassphrase: "second passphrase",
					bridgechainId: "2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867",
					fee: new BigNumber(0.1 * 1e8),
					wif: undefined,
					networkWif: 170,
					multiSignature: undefined,
				});
			});
		});

		describe("buildTransaction", () => {
			it("should build business resignation", async () => {
				const transactionData = {
					type: 0,
					typeGroup: 2,
				};

				const response = await wrapper.vm.buildTransaction(transactionData, true, true);

				expect(wrapper.vm.$client.buildBridgechainResignation).toHaveBeenCalledWith(
					transactionData,
					true,
					true,
				);
				expect(response).toBe(transactionData);
			});

			it("should build business resignation with default arguments", async () => {
				const transactionData = {
					type: 0,
					typeGroup: 2,
				};

				const response = await wrapper.vm.buildTransaction(transactionData);

				expect(wrapper.vm.$client.buildBridgechainResignation).toHaveBeenCalledWith(
					transactionData,
					false,
					false,
				);
				expect(response).toBe(transactionData);
			});
		});

		describe("transactionError", () => {
			it("should generate transaction error", () => {
				wrapper.vm.transactionError();

				expect(wrapper.vm.$error).toHaveBeenCalledWith("TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_RESIGNATION");
			});
		});
	});
});
