import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { TransactionFixture } from "tests/fixtures/transactions";
import { getDefaultProfileId, renderWithRouter, syncDelegates, waitFor } from "utils/testing-library";

import { translations } from "../../i18n";
import { VoteDetail } from "./VoteDetail";

const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

jest.setTimeout(10000);

describe("VoteDetail", () => {
	beforeAll(async () => {
		nock.cleanAll();
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/delegates-devnet.json"))
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
		history.push(dashboardURL);
	});

	it("should not render if not open", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail isOpen={false} transaction={TransactionFixture} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", async () => {
		const { asFragment, getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail isOpen={true} transaction={TransactionFixture} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE),
		);
		await waitFor(() => expect(queryAllByTestId("VoteDetails__delegates-container")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal as confirmed", async () => {
		const { asFragment, getByTestId, getByText, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail
					isOpen={true}
					transaction={{
						...TransactionFixture,
						sender: () => "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
						votes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
						isConfirmed: () => true,
					}}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE),
		);
		await waitFor(() => expect(getByText("Well Confirmed")).toBeInTheDocument());
		await waitFor(() => expect(getByText("arkx")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with wallet alias", async () => {
		const { asFragment, getByTestId, getByText, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail isOpen={true} transaction={TransactionFixture} walletAlias="Wallet Alias" />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE),
		);
		await waitFor(() => expect(queryAllByTestId("VoteDetails__delegates-container")).toHaveLength(1));
		await waitFor(() => expect(getByText("Wallet Alias")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should throw error with a unknown sender", () => {
		jest.spyOn(console, "error").mockImplementation(() => null);
		expect(() =>
			renderWithRouter(
				<Route path="/profiles/:profileId/dashboard">
					<VoteDetail isOpen={true} transaction={{ ...TransactionFixture, sender: () => "" }} />
				</Route>,
				{
					routes: [dashboardURL],
					history,
				},
			),
		).toThrowError();
		console.error.mockRestore();
	});
});
