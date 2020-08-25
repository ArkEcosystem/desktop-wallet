/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { AddressRow } from "./AddressRow";

let profile: Profile;
let wallet: ReadWriteWallet;

const renderPage = async (wallet: ReadWriteWallet, onSelect?: any) => {
	const rendered = render(
		<table>
			<tbody>
				<AddressRow index={0} wallet={wallet} onSelect={onSelect} />
			</tbody>
		</table>,
	);

	await waitFor(() => expect(rendered.getByTestId("AddressRow__select-0")).toBeTruthy());
	return rendered;
};

describe("AddressRow", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);

		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/delegates-devnet.json"))
			.persist();
	});

	it("should render", async () => {
		const { container, asFragment } = await renderPage(wallet);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", async () => {
		const onSelect = jest.fn();
		const { container, asFragment, getByTestId } = await renderPage(wallet, onSelect);
		const selectButton = getByTestId("AddressRow__select-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith(wallet.address());
		expect(asFragment()).toMatchSnapshot();
	});
});
