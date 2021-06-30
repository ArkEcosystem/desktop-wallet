import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, waitFor } from "utils/testing-library";

import { NotificationsDropdown } from ".";
const NotificationTransactionsFixtures = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");
const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

const history = createMemoryHistory();
let profile: Contracts.IProfile;

describe("Notifications", () => {
	beforeEach(async () => {
		const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
		history.push(dashboardURL);

		nock("https://dwallets.ark.io").get("/api/transactions").query(true).reply(200, {
			data: NotificationTransactionsFixtures.data,
			meta: TransactionsFixture.meta,
		});

		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("should render with transactions and plugins", async () => {
		const { container, getAllByRole, getAllByTestId, queryAllByTestId } = render(
			<NotificationsDropdown profile={profile} />,
		);

		act(() => {
			fireEvent.click(getAllByRole("button")[0]);
		});

		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("TransactionRowMode").length).toBeGreaterThan(0));

		expect(container).toMatchSnapshot();
	});

	it("should open and close transaction details modal", async () => {
		await profile.sync();

		const { container, getAllByRole, getByTestId, queryAllByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NotificationsDropdown profile={profile} />
			</Route>,
			{
				history,
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		act(() => {
			fireEvent.click(getAllByRole("button")[0]);
		});

		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("TransactionRowMode").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(getAllByTestId("TransactionRowMode")[0]);
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/^Unable to find an element by/));
		expect(container).toMatchSnapshot();
	});

	it("should open and close wallet update notification modal", async () => {
		const { container, getAllByRole, getByTestId, queryAllByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NotificationsDropdown profile={profile} />
			</Route>,
			{
				history,
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		act(() => {
			fireEvent.click(getAllByRole("button")[0]);
		});

		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("TransactionRowMode").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(getAllByTestId("NotificationItem__action")[0]);
		});

		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/^Unable to find an element by/));
		expect(container).toMatchSnapshot();
	});

	it("should open and cancel wallet update notification modal", async () => {
		const { container, getAllByRole, getByTestId, queryAllByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NotificationsDropdown profile={profile} />
			</Route>,
			{
				history,
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		act(() => {
			fireEvent.click(getAllByRole("button")[0]);
		});

		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("TransactionRowMode").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(getAllByTestId("NotificationItem__action")[0]);
		});

		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("WalletUpdate__cancel-button"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/^Unable to find an element by/));
		expect(container).toMatchSnapshot();
	});
});
