import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { NotificationTransactionItem } from "./NotificationTransactionItem";

let profile: Contracts.IProfile;
let notification: any;

describe("Notifications", () => {
	beforeEach(() => {
		httpClient.clearCache();

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
					<NotificationTransactionItem
						transactionId={notification.meta.transactionId}
						allTransactions={[TransactionFixture]}
						profile={profile}
					/>
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
						transactionId={notification.meta.transactionId}
						allTransactions={[TransactionFixture]}
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
						transactionId={notification.meta.transactionId}
						allTransactions={[TransactionFixture]}
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
