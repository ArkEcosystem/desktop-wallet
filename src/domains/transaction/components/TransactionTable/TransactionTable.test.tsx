import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import * as useRandomNumberHook from "app/hooks/use-random-number";
import nock from "nock";
import React from "react";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletId,
	renderWithRouter,
	waitFor,
} from "utils/testing-library";

import { TransactionTable } from "./TransactionTable";

describe("TransactionTable", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;
	let transactions: DTO.ExtendedTransactionData[];

	beforeAll(() => {
		nock("https://dwallets.ark.io/api")
			.get("/transactions")
			.query(true)
			.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"));
	});

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());
		transactions = (await wallet.transactions()).items();
	});

	it("should render", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(<TransactionTable transactions={transactions} />);
		expect(getAllByTestId("TableRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with currency", () => {
		const { getAllByTestId } = renderWithRouter(
			<TransactionTable transactions={transactions} exchangeCurrency="BTC" />,
		);
		expect(getAllByTestId("TransactionRow__currency")).toHaveLength(transactions.length);
	});

	it("should render with sign", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<TransactionTable transactions={transactions} showSignColumn />,
		);
		expect(getAllByTestId("TransactionRow__sign")).toHaveLength(15);
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
			<TransactionTable transactions={transactions} onRowClick={onClick} isCompact />,
		);
		const rows = getAllByTestId("TableRow");
		act(() => {
			fireEvent.click(rows[0]);
		});
		await waitFor(() => expect(onClick).toHaveBeenCalledWith(transactions[1]));
	});
});
