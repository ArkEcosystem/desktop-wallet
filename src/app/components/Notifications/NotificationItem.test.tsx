import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { NotificationItem } from "./NotificationItem";

const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

let profile: Contracts.IProfile;
let notification: any;

describe("Notifications", () => {
	beforeAll(() => {
		nock("https://dwallets.ark.io").get("/api/transactions").query(true).reply(200, {
			data: TransactionsFixture.data,
			meta: TransactionsFixture.meta,
		});

		profile = env.profiles().findById(getDefaultProfileId());
		notification = profile.notifications().first();
	});

	it("should render notification item", () => {
		const { container } = render(
			<table>
				<tbody>
					<NotificationItem {...notification} />
				</tbody>
			</table>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should emit onAction event", async () => {
		const onAction = jest.fn();
		const { getByTestId } = render(
			<table>
				<tbody>
					<NotificationItem {...notification} onAction={onAction} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("NotificationItem__action"));
		});

		await waitFor(() => expect(onAction).toHaveBeenCalled());
	});

	it("should emit onVisibilityChange event", async () => {
		const onVisibilityChange = jest.fn();
		render(
			<table>
				<tbody>
					<NotificationItem {...notification} onVisibilityChange={onVisibilityChange} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(onVisibilityChange).toHaveBeenCalled());
	});

	it("should render with custom action name", () => {
		const onVisibilityChange = jest.fn();
		profile.notifications().push({
			action: "custom action name",
			body: "test",
			icon: "ArkLogo",
			name: "New plugin updates",
			type: "plugin",
		});
		profile.notifications().last();

		const { container, getByTestId } = render(
			<table>
				<tbody>
					<NotificationItem {...profile.notifications().last()} onVisibilityChange={onVisibilityChange} />
				</tbody>
			</table>,
		);
		expect(getByTestId("NotificationItem__action")).toHaveTextContent(profile.notifications().last().action);
		expect(container).toMatchSnapshot();
	});
});
