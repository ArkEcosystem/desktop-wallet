import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, waitFor } from "testing-library";

import { NotificationsDropdown } from "./";

const history = createMemoryHistory();
let profile: Profile;

describe("Notifications", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
		history.push(dashboardURL);

		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
				return {
					meta,
					data: data.slice(0, 2),
				};
			})
			.persist();
	});

	it("should render with transactions and plugins", async () => {
		const allNotifications = profile.notifications().count();

		await act(async () => {
			const { container, getAllByTestId, getByTestId } = render(<NotificationsDropdown profile={profile} />);

			fireEvent.click(getByTestId("dropdown__toggle"));

			await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(allNotifications));
			await waitFor(() => expect(getByTestId("TransactionTable")).toBeTruthy());
			expect(container).toMatchSnapshot();
		});
	});

	it("should open and close transaction details modal", async () => {
		const allNotifications = profile.notifications().count();

		await act(async () => {
			const { container, getByTestId, getAllByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/dashboard">
					<NotificationsDropdown profile={profile} />
				</Route>,
				{
					routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
					history,
				},
			);

			fireEvent.click(getByTestId("dropdown__toggle"));

			await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(allNotifications));
			await waitFor(() => expect(getByTestId("TransactionTable")).toBeTruthy());
			await waitFor(() => expect(getAllByTestId("TableRow")).toHaveLength(4));

			fireEvent.click(getAllByTestId("TableRow")[2]);
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
			expect(container).toMatchSnapshot();

			fireEvent.click(getByTestId("modal__close-btn"));
			await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/^Unable to find an element by/));
			expect(container).toMatchSnapshot();
		});
	});
});
