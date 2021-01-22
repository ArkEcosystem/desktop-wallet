import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, waitFor } from "testing-library";
const NotificationTransactionsFixtures = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");

import { NotificationsDropdown } from "./";

const history = createMemoryHistory();
let profile: Profile;

describe("Notifications", () => {
	beforeEach(() => {
		const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
		history.push(dashboardURL);

		nock("https://dwallets.ark.io")
			.get("/api/transactions/ea63bf9a4b3eaf75a1dfff721967c45dce64eb7facf1aef29461868681b5c79b")
			.reply(200, { data: NotificationTransactionsFixtures.data[0] })
			.get("/api/transactions/1a767ebc0cc53246b9105a9f09b6c2ffa7baedcc7e632c8c1bac58f8f17389f6")
			.reply(200, { data: NotificationTransactionsFixtures.data[1] });

		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render with transactions and plugins", async () => {
		const { container, getAllByRole, getAllByTestId, queryAllByTestId, getByTestId } = render(
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
		const { container, getAllByRole, getByTestId, queryAllByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NotificationsDropdown profile={profile} />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
				history,
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
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
				history,
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
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
				history,
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
