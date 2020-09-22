import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act } from "react-dom/test-utils";
import { env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { Notifications } from "./Notifications";

const plugins = [
	{
		icon: "Warning",
		logoUrl: "/static/media/ark-logo.bafd72bb.png",
		logoClassName: "flex p-2 mr-4 rounded-lg bg-logo",
		name: "ARK Explorer",
		body: "- update v2.5.6",
		action: "update",
	},
];

const transactions = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213281),
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
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		total: () => BigNumber.make(121).times(1e8),
		convertedTotal: () => BigNumber.ZERO,
		wallet: () => undefined,
		coin: () => undefined,
		data: () => undefined,
	},
];

let profile: Profile;

describe("Notifications", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		profile.notifications().push({
			icon: "ArkLogo",
			name: "New plugin updates",
			body: "test",
			action: "Goto",
		});

		const notes = profile.notifications().values();
	});

	it("should render empty without profile", () => {
		const { container } = render(<Notifications />);
		expect(container).toMatchSnapshot();
	});

	it("should render empty without notifications", () => {
		const { container } = render(<Notifications profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render plugins", () => {
		const { container } = render(<Notifications profile={profile} pluginsHeader="Plugins" plugins={plugins} />);
		expect(container).toMatchSnapshot();
	});

	it("should render transactions", () => {
		const { container } = render(
			<Notifications profile={profile} pluginsHeader="Transactions" transactions={transactions} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should emit onAction event when plugin action clicked", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<Notifications profile={profile} pluginsHeader="Plugins" plugins={plugins} onAction={fn} />,
		);
		const toggle = getByTestId("NotificationItem__action");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});

	it("should not emit onAction event if callback is not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<Notifications profile={profile} pluginsHeader="Plugins" plugins={plugins} />);
		const toggle = getByTestId("NotificationItem__action");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});

	it("should emit onAction event when transaction was clicked", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<Notifications
				profile={profile}
				transactionsHeader="Transactions"
				transactions={transactions}
				onAction={fn}
			/>,
		);
		const toggle = getByTestId("TableRow");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});
});
