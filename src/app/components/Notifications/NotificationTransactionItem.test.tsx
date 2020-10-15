import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { NotificationTransactionItem } from "./NotificationTransactionItem";
const NotificationTransactionsFixtures = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");

let profile: Profile;
let notification: any;

describe("Notifications", () => {
	beforeEach(() => {
		httpClient.clearCache();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/ea63bf9a4b3eaf75a1dfff721967c45dce64eb7facf1aef29461868681b5c79b")
			.reply(200, { data: NotificationTransactionsFixtures.data[0] });

		profile = env.profiles().findById(getDefaultProfileId());

		notification = profile
			.notifications()
			.values()
			.find((n) => n.type === "transaction");
	});

	it("should render notification item", async () => {
		const { container, getAllByTestId } = render(
			<table>
				<tbody>
					<NotificationTransactionItem notification={notification} profile={profile} />
				</tbody>
			</table>,
		);
		await waitFor(() => expect(getAllByTestId("TransactionRowMode").length).toEqual(1));
		expect(container).toMatchSnapshot();
	});

	it("should emit onVisibilityChange event", async () => {
		const onVisibilityChange = jest.fn();

		const { getAllByTestId } = render(
			<table>
				<tbody>
					<NotificationTransactionItem
						notification={notification}
						profile={profile}
						onVisibilityChange={onVisibilityChange}
					/>
				</tbody>
			</table>,
		);
		await waitFor(() => expect(getAllByTestId("TransactionRowMode").length).toEqual(1));
		await waitFor(() => expect(onVisibilityChange).toHaveBeenCalled());
	});

	it("should emit events onTransactionClick", async () => {
		const onTransactionClick = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<NotificationTransactionItem
						notification={notification}
						profile={profile}
						onTransactionClick={onTransactionClick}
					/>
				</tbody>
			</table>,
		);
		await waitFor(() => expect(getAllByTestId("TransactionRowMode").length).toEqual(1));

		act(() => {
			fireEvent.click(getByTestId("TransactionRowMode"));
		});
		await waitFor(() => expect(onTransactionClick).toHaveBeenCalled());
	});
});
