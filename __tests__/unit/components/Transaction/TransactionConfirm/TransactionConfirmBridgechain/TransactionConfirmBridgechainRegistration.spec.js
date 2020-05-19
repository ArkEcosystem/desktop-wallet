import { createLocalVue, mount } from "@vue/test-utils";

import TransactionConfirmBridgechainRegistration from "@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainRegistration";

import installI18n from "../../../../__utils__/i18n";

const localVue = createLocalVue();
const i18n = installI18n(localVue);

let wrapper;
const createWrapper = (component, transaction) => {
	component = component || TransactionConfirmBridgechainRegistration;
	transaction = transaction || {
		asset: {
			bridgechainRegistration: {
				name: "test bridgechain",
				genesisHash: "genesis_hash_1234",
				seedNodes: ["1.1.1.1", "2.2.2.2"],
				ports: {
					"@arkecosystem/core-api": 4003,
				},
				bridgechainRepository: "https://github.com/arkecosystem/core.git",
			},
		},
	};

	wrapper = mount(component, {
		i18n,
		localVue,
		sync: false,
		provide: {
			currentWallet: {
				address: "address-1",
			},
			transaction,
		},
		mocks: {
			wallet_formatAddress: jest.fn((address) => `formatted-${address}`),
		},
	});
};

describe("TransactionConfirmBridgechainRegistration", () => {
	beforeEach(() => {
		createWrapper();
	});

	it("should have magistrates transaction group (2)", () => {
		expect(wrapper.vm.$options.transactionGroup).toBe(2);
	});

	it("should have bridgechain registration transaction type (3)", () => {
		expect(wrapper.vm.$options.transactionType).toBe(3);
	});

	describe("template", () => {
		it("should render", () => {
			expect(wrapper.contains(".TransactionConfirmBridgechainRegistration")).toBe(true);
		});

		it("should output senderLabel", () => {
			expect(
				wrapper
					.find(".TransactionConfirmBridgechainRegistration__sender .ListDividedItem__value span:first-child")
					.text(),
			).toBe("formatted-address-1");
		});

		it("should output name", () => {
			expect(
				wrapper.find(".TransactionConfirmBridgechainRegistration__name .ListDividedItem__value").text(),
			).toBe("test bridgechain");
		});

		it("should output genesis hash (truncated)", () => {
			expect(
				wrapper.find(".TransactionConfirmBridgechainRegistration__genesis-hash .ListDividedItem__value").text(),
			).toBe("genes…_1234");
		});

		it("should output seed nodes", () => {
			const seedNodes = wrapper.findAll(
				".TransactionConfirmBridgechainRegistration__seed-nodes .ListDividedItem__value > div",
			);
			for (const seedNodeIndex in wrapper.vm.transaction.asset.bridgechainRegistration.seedNodes) {
				expect(seedNodes.at(seedNodeIndex).text()).toBe(
					wrapper.vm.transaction.asset.bridgechainRegistration.seedNodes[seedNodeIndex],
				);
			}
		});

		it("should output api port", () => {
			expect(
				wrapper.find(".TransactionConfirmBridgechainRegistration__api-port .ListDividedItem__value").text(),
			).toBe("4003");
		});

		it("should output bridgechain repo", () => {
			expect(
				wrapper
					.find(".TransactionConfirmBridgechainRegistration__bridgechain-repo .ListDividedItem__value")
					.text(),
			).toBe("https://github.com/arkecosystem/core.git");
		});
	});

	describe("computed", () => {
		describe("senderLabel", () => {
			it("should return a formatted address", () => {
				expect(wrapper.vm.senderLabel).toBe("formatted-address-1");
			});
		});

		describe("apiPort", () => {
			it("should return core-api port if provided", () => {
				expect(wrapper.vm.apiPort).toBe(4003);
			});

			it("should return null if no core-api port", () => {
				createWrapper(null, {
					asset: {
						bridgechainRegistration: {
							name: "test",
							genesisHash: "1234",
							seedNodes: ["1.1.1.1", "2.2.2.2"],
							ports: {},
							bridgechainRepository: "https://github.com/arkecosystem/core.git",
						},
					},
				});

				expect(wrapper.vm.apiPort).toBe(null);
			});
		});
	});
});
