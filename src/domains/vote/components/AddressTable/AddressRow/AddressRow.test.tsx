/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates, waitFor } from "testing-library";
import walletMock from "tests/fixtures/coins/ark/devnet/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";

import { AddressRow } from "./AddressRow";

let profile: Profile;
let wallet: ReadWriteWallet;
let blankWallet: ReadWriteWallet;
let unvotedWallet: ReadWriteWallet;

let emptyProfile: Profile;
let wallet2: ReadWriteWallet;

const blankWalletPassphrase = "power return attend drink piece found tragic fire liar page disease combine";

describe("AddressRow", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.LedgerIndex, true);

		blankWallet = await profile.wallets().importByMnemonic(blankWalletPassphrase, "ARK", "ark.devnet");
		unvotedWallet = await profile.wallets().importByMnemonic("unvoted wallet", "ARK", "ark.devnet");

		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		wallet2 = await emptyProfile.wallets().importByMnemonic("wallet 2", "ARK", "ark.devnet");

		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/devnet/delegates.json"))
			.get(`/api/wallets/${unvotedWallet.address()}`)
			.reply(200, walletMock)
			.get(`/api/wallets/${blankWallet.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.get(`/api/wallets/${wallet2.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.persist();

		await syncDelegates();
		await wallet.syncVotes();
	});

	it("should render", async () => {
		const { asFragment, container, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet not found for votes", async () => {
		const { asFragment, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} wallet={wallet} />
					<AddressRow index={1} wallet={blankWallet} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		await waitFor(() => expect(getByTestId("AddressRow__select-0")).toBeTruthy());
		await waitFor(() => expect(getByTestId("AddressRow__select-1")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet hasn't voted", async () => {
		const { asFragment, getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} wallet={wallet} />
					<AddressRow index={1} wallet={unvotedWallet} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(getAllByTestId("AddressRow__status")).toBeTruthy());
		await waitFor(() => expect(getByTestId("AddressRow__select-0")).toBeTruthy());
		await waitFor(() => expect(getByTestId("AddressRow__select-1")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", async () => {
		const onSelect = jest.fn();
		const { asFragment, container, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} wallet={wallet} onSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("AddressRow__select-0");

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith(wallet.address());
		expect(asFragment()).toMatchSnapshot();
	});
});
