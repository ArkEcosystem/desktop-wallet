import { createLocalVue, mount } from "@vue/test-utils";

import TransactionConfirmBridgechainUpdate from "@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainUpdate";

import installI18n from "../../../../__utils__/i18n";

const localVue = createLocalVue();
const i18n = installI18n(localVue);

let wrapper;
const createWrapper = (component, transaction) => {
	component = component || TransactionConfirmBridgechainUpdate;
	transaction = transaction || {
		asset: {
			bridgechainUpdate: {
				seedNodes: ["1.1.1.1", "2.2.2.2"],
				ports: {
					"@arkecosystem/core-api": 4003,
				},
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

describe("TransactionConfirmBridgechainUpdate", () => {
	beforeEach(() => {
		createWrapper();
	});

	it("should have magistrates transaction group (2)", () => {
		expect(wrapper.vm.$options.transactionGroup).toBe(2);
	});

	it("should have bridgechain update transaction type (5)", () => {
		expect(wrapper.vm.$options.transactionType).toBe(5);
	});

	describe("template", () => {
		it("should render", () => {
			expect(wrapper.contains(".TransactionConfirmBridgechainUpdate")).toBe(true);
		});

		it("should output senderLabel", () => {
			expect(
				wrapper
					.find(".TransactionConfirmBridgechainUpdate__sender .ListDividedItem__value span:first-child")
					.text(),
			).toBe("formatted-address-1");
		});

		it("should output seed nodes", () => {
			const seedNodes = wrapper.findAll(
				".TransactionConfirmBridgechainUpdate__seed-nodes .ListDividedItem__value > div",
			);
			for (const seedNodeIndex in wrapper.vm.transaction.asset.bridgechainUpdate.seedNodes) {
				expect(seedNodes.at(seedNodeIndex).text()).toBe(
					wrapper.vm.transaction.asset.bridgechainUpdate.seedNodes[seedNodeIndex],
				);
			}
		});

		it("should output api port", () => {
			expect(wrapper.find(".TransactionConfirmBridgechainUpdate__api-port .ListDividedItem__value").text()).toBe(
				"4003",
			);
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
						bridgechainUpdate: {
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
