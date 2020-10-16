import { DelegateMapper, ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
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
			.reply(200, require("tests/fixtures/coins/ark/devnet/delegates.json"))
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
		history.push(dashboardURL);

		jest.spyOn(DelegateMapper, "execute").mockImplementation((wallet, votes) =>
			votes.map(
				(vote: string, index: number) =>
					new ReadOnlyWallet({
						address: vote,
						username: `delegate-${index}`,
					}),
			),
		);
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

	it("should render a modal with votes", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail
					isOpen={true}
					transaction={{
						...TransactionFixture,
						votes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
						unvotes: () => [],
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

		await waitFor(() => expect(getByText("Votes (1)")).toBeTruthy());
		await waitFor(() => expect(getByText("delegate-0")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with unvotes", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail
					isOpen={true}
					transaction={{
						...TransactionFixture,
						votes: () => [],
						unvotes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
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

		await waitFor(() => expect(getByText("Unvotes (1)")).toBeTruthy());
		await waitFor(() => expect(getByText("delegate-0")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with votes and unvotes", async () => {
		const { asFragment, getByTestId, getAllByText, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail
					isOpen={true}
					transaction={{
						...TransactionFixture,
						votes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
						unvotes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
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

		await waitFor(() => expect(getByText("Votes (1)")).toBeTruthy());
		await waitFor(() => expect(getByText("Unvotes (1)")).toBeTruthy());
		await waitFor(() => expect(getAllByText("delegate-0")).toHaveLength(2));

		expect(asFragment()).toMatchSnapshot();
	});
});
