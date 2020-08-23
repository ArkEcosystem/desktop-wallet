import { Profile, Wallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { AddressRow } from "./AddressRow";

let profile: Profile;
let wallet: Wallet;

describe("AddressRow", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<AddressRow index={1} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", () => {
		const onSelect = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={1} wallet={wallet} onSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("AddressRow__select-1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith(wallet.address());
		expect(asFragment()).toMatchSnapshot();
	});
});
