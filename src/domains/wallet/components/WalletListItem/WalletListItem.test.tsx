import React from "react";
import { render } from "testing-library";

import { WalletListItem } from "./WalletListItem";

const wallet = {
	id: () => "id5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
	address: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
	alias: () => "Test Wallet",
	avatar: () => "data:image/png;base64,avatarImage",
	coinId: () => "ARK",
	networkId: () => "ark.devnet",
	isDelegate: () => true,
	isResignedDelegate: () => false,
	hasSyncedWithNetwork: () => true,
};

const options = [
	{ label: "Option 1", value: "1" },
	{ label: "Option 2", value: "2" },
];

describe("Wallet List Item", () => {
	it("should render", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} options={options} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as condensend", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} isCondensed options={options} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without tippy", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<WalletListItem wallet={{ ...wallet, isDelegate: () => false }} options={options} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
