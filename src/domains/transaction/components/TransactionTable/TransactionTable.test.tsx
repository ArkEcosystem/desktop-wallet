import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { sortByDesc } from "@arkecosystem/utils";
import * as useRandomNumberHook from "app/hooks/use-random-number";
import React from "react";
import { act, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";

import { TransactionTable } from "./TransactionTable";

// TODO: replace those with real transaction instances. These are highly fragile and make the tests brittle because every update requires them to be adjusted and they could have fake implementations.
const transactions: ExtendedTransactionData[] = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213282),
		confirmations: () => BigNumber.make(10),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(100),
		fee: () => BigNumber.make(21),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => false,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isProductEntityRegistration: () => false,
		isProductEntityResignation: () => false,
		isProductEntityUpdate: () => false,
		isPluginEntityRegistration: () => false,
		isPluginEntityResignation: () => false,
		isPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		total: () => BigNumber.make(121).times(1e8),
		convertedTotal: () => BigNumber.ZERO,
		wallet: () => undefined,
		coin: () => undefined,
		data: () => undefined,
	},
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(5),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(52),
		fee: () => BigNumber.make(0.2),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => true,
		isMultiSignature: () => true,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isProductEntityRegistration: () => false,
		isProductEntityResignation: () => false,
		isProductEntityUpdate: () => false,
		isPluginEntityRegistration: () => false,
		isPluginEntityResignation: () => false,
		isPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		total: () => BigNumber.make(121).times(1e8),
		convertedTotal: () => BigNumber.ZERO,
		wallet: () => undefined,
		coin: () => undefined,
		data: () => undefined,
	},
];

describe("TransactionTable", () => {
	it("should render", () => {
		// @ts-ignore - TODO: brittle fixtures
		const { getAllByTestId, asFragment } = renderWithRouter(<TransactionTable transactions={transactions} />);
		expect(getAllByTestId("TableRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with currency", () => {
		// @ts-ignore - TODO: brittle fixtures
		const { getAllByTestId } = renderWithRouter(
			<TransactionTable transactions={transactions} exchangeCurrency="BTC" />,
		);
		expect(getAllByTestId("TransactionRow__currency")).toHaveLength(transactions.length);
	});

	it("should render with sign", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			// @ts-ignore - TODO: brittle fixtures
			<TransactionTable transactions={transactions} showSignColumn />,
		);
		expect(getAllByTestId("TransactionRow__sign")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without explorer link column", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			// @ts-ignore - TODO: brittle fixtures
			<TransactionTable transactions={transactions} showExplorerLinkColumn={false} />,
		);
		expect(() => getAllByTestId("TransactionRow__ID")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render compact", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			// @ts-ignore - TODO: brittle fixtures
			<TransactionTable transactions={transactions} isCompact />,
		);
		expect(getAllByTestId("TableRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});

	describe("loading state", () => {
		beforeAll(() => {
			jest.spyOn(useRandomNumberHook, "useRandomNumber").mockImplementation(() => 1);
		});

		afterAll(() => {
			useRandomNumberHook.useRandomNumber.mockRestore();
		});

		it("should render", () => {
			const { getAllByTestId, asFragment } = renderWithRouter(
				<TransactionTable transactions={[]} isLoading skeletonRowsLimit={5} />,
			);
			expect(getAllByTestId("TableRow")).toHaveLength(5);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render with sign column", () => {
			const { getAllByTestId, asFragment } = renderWithRouter(
				<TransactionTable transactions={[]} isLoading showSignColumn skeletonRowsLimit={5} />,
			);
			expect(getAllByTestId("TableRow")).toHaveLength(5);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render with currency column", () => {
			const { getAllByTestId, asFragment } = renderWithRouter(
				<TransactionTable transactions={[]} isLoading exchangeCurrency="BTC" skeletonRowsLimit={5} />,
			);
			expect(getAllByTestId("TableRow")).toHaveLength(5);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should emit action on the row click", () => {
		const onClick = jest.fn();
		const sortedByDateDesc = sortByDesc(transactions, (transaction) => transaction.timestamp());
		const { getAllByTestId } = renderWithRouter(
			// @ts-ignore - TODO: brittle fixtures
			<TransactionTable transactions={sortedByDateDesc} onRowClick={onClick} />,
		);
		const rows = getAllByTestId("TableRow");
		act(() => {
			fireEvent.click(rows[0]);
		});
		expect(onClick).toHaveBeenCalledWith(sortedByDateDesc[0]);
	});

	it("should emit action on the compact row click", async () => {
		const onClick = jest.fn();
		const { getAllByTestId } = renderWithRouter(
			// @ts-ignore - TODO: brittle fixtures
			<TransactionTable transactions={transactions} onRowClick={onClick} isCompact />,
		);
		const rows = getAllByTestId("TableRow");
		act(() => {
			fireEvent.click(rows[0]);
		});
		await waitFor(() => expect(onClick).toHaveBeenCalledWith(transactions[1]));
	});
});
