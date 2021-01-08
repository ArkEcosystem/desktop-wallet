/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	syncDelegates,
	useDefaultNetMocks,
	waitFor,
	within,
} from "utils/testing-library";

import { Transactions } from "./Transactions";

const history = createMemoryHistory();
let profile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

beforeAll(async () => {
	useDefaultNetMocks();

	nock("https://neoscan.io/api/main_net/v1/")
		.get("/get_last_transactions_by_address/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX/1")
		.reply(200, []);

	nock("https://dwallets.ark.io")
		.get("/api/transactions")
		.query(true)
		.reply(200, () => {
			const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
			return {
				meta,
				data: data.slice(0, 2),
			};
		})
		.persist();

	profile = env.profiles().findById(fixtureProfileId);

	await syncDelegates();
});

beforeEach(() => {
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
});

describe("Transactions", () => {
	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render hidden", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard" isVisible={false}>
				<Transactions profile={profile} isVisible={false} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should filter by type", async () => {
		const { getByRole, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByRole("button", { name: /Type/ }));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));
	});

	it("should filer by type and see empty screen", async () => {
		const emptyProfile = env.profiles().create("test");
		const emptyProfileURL = `/profiles/${emptyProfile.id()}/dashboard`;

		const { getByRole, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions profile={emptyProfile} />
			</Route>,
			{
				routes: [emptyProfileURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("EmptyBlock")).toBeInTheDocument());

		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByRole("button", { name: /Type/ }));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		await waitFor(() => expect(getByTestId("EmptyResults")).toBeInTheDocument());
	});

	it("should open detail modal on transaction row click", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

		act(() => {
			fireEvent.click(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeInTheDocument();
		});

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fetch more transactions", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions profile={profile} isLoading={false} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => {
			expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.VIEW_MORE);
			expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4);
		});

		act(() => {
			fireEvent.click(getByTestId("transactions__fetch-more-button"));
		});

		expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.LOADING);

		await waitFor(() => {
			expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.VIEW_MORE);
			expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(8);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show loading state if set", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Transactions isLoading={true} profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => {
			expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(8);
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
