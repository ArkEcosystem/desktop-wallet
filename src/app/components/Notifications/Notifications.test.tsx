import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { Notifications } from "./Notifications";

describe("Notifications", () => {
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
			date: "17 Mar 2020 22:02:10",
			avatarId: "test",
			type: "receive",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			amount: "100 BTC",
			fiat: "1,000,000 USD",
		},
	];

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
		const { getByTestId } = render(
			<Notifications transactionsHeader="Transactions" transactions={transactions} onAction={fn} />,
		);
		const toggle = getByTestId("transaction__row");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});

	it("should not emit onAction event when transaction was clicked and allback not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<Notifications transactionsHeader="Transactions" transactions={transactions} />);
		const toggle = getByTestId("transaction__row");
		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});
});
