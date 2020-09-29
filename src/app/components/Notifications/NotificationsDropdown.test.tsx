import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, waitFor } from "testing-library";
const NotificationTransactionsFixtures = require("tests/fixtures/coins/ark/notification-transactions.json");

import { NotificationsDropdown } from "./";

const history = createMemoryHistory();
let profile: Profile;

describe("Notifications", () => {
	beforeEach(() => {
		const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
		history.push(dashboardURL);

		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.query(true)
			.reply(200, NotificationTransactionsFixtures);

		profile = env.profiles().findById(getDefaultProfileId());
		profile.transactionAggregate().flush();
	});

	it("should render with transactions and plugins", async () => {
		const { container, getAllByTestId, queryAllByTestId, getByTestId } = render(
			<NotificationsDropdown profile={profile} />,
		);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("TransactionRowMode").length).toBeGreaterThan(0));

		expect(container).toMatchSnapshot();
	});

	it("should open and close transaction details modal", async () => {
		const { container, getByTestId, queryAllByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NotificationsDropdown profile={profile} />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("dropdown__toggle")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
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
});
