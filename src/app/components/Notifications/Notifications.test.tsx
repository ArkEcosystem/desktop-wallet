import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";

import { Notifications } from "./Notifications";

const plugins = [
	{
		logoUrl: "/static/media/ark-logo.bafd72bb.png",
		logoClassName: "flex p-2 mr-4 rounded-lg bg-logo",
		title: "ARK Explorer",
		description: "- update v2.5.6",
		action: {
			label: "Update now",
			value: "update",
		},
	},
];

const transactions = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		type: () => "transfer",
		timestamp: () => 1596213281,
		confirmations: () => BigNumber.make(10),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(100),
		fee: () => BigNumber.make(21),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => false,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isBusinessRegistration: () => false,
		isBusinessResignation: () => false,
		isBusinessUpdate: () => false,
		isBridgechainRegistration: () => false,
		isBridgechainResignation: () => false,
		isBridgechainUpdate: () => false,
		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
	},
];

describe("Notifications", () => {
	it("should render", () => {
		const { container } = render(<Notifications />);
		expect(container).toMatchSnapshot();
	});

	it("should render plugins", () => {
		const { container } = render(<Notifications pluginsHeader="Plugins" plugins={plugins} />);
		expect(container).toMatchSnapshot();
	});

	it("should render transactions", () => {
		const { container } = render(<Notifications pluginsHeader="Transactions" transactions={transactions} />);
		expect(container).toMatchSnapshot();
	});

	it("should emit onAction event when plugin action clicked", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<Notifications pluginsHeader="Plugins" plugins={plugins} onAction={fn} />);
		const toggle = getByTestId("notifications__plugin-action");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});

	it("should not emit onAction event when plugin action clicked and allback not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<Notifications pluginsHeader="Plugins" plugins={plugins} />);
		const toggle = getByTestId("notifications__plugin-action");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});

	it("should emit onAction event when transaction was clicked", () => {
		const fn = jest.fn();
		const { getByRole } = render(
			<Notifications transactionsHeader="Transactions" transactions={transactions} onAction={fn} />,
		);
		const toggle = getByRole("row");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});
});
