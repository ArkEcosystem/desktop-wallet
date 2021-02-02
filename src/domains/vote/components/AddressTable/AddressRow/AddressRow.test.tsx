/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadOnlyWallet, ReadWriteWallet, WalletData, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates, waitFor } from "testing-library";
import { data } from "tests/fixtures/coins/ark/devnet/delegates.json";
import walletMock from "tests/fixtures/coins/ark/devnet/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";
import * as utils from "utils/electron-utils";

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
		wallet.data().set(WalletData.LedgerPath, "0");

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
					<AddressRow index={0} maxVotes={1} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events", (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { asFragment, getByText } = render(
			<table>
				<tbody>
					<AddressRow index={0} maxVotes={1} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();

		fireEvent.mouseEnter(getByText(wallet.alias()));
		fireEvent.mouseLeave(getByText(wallet.alias()));

		expect(setState).toHaveBeenCalled();
	});

	it("should render when the maximum votes is greater than 1", () => {
		const votesMock = jest.spyOn(wallet, "votes").mockReturnValue(
			[0, 1, 2, 3].map(
				(index) =>
					new ReadOnlyWallet({
						address: data[index].address,
						explorerLink: "",
						publicKey: data[index].publicKey,
						username: data[index].username,
						rank: data[index].rank,
					}),
			),
		);

		const { asFragment, container } = render(
			<table>
				<tbody>
					<AddressRow index={0} maxVotes={10} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		votesMock.mockRestore();
	});

	it("should render when the wallet has many votes", () => {
		const votesMock = jest.spyOn(wallet, "votes").mockReturnValue(
			[0, 1, 2, 3, 4].map(
				(index) =>
					new ReadOnlyWallet({
						address: data[index].address,
						explorerLink: "",
						publicKey: data[index].publicKey,
						username: data[index].username,
						rank: data[index].rank,
					}),
			),
		);

		const { asFragment, container } = render(
			<table>
				<tbody>
					<AddressRow index={0} maxVotes={10} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		votesMock.mockRestore();
	});

	it("should render for a multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		const { asFragment, container, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} maxVotes={1} wallet={wallet} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
		isMultiSignatureSpy.mockRestore();
	});

	it("should render when wallet not found for votes", async () => {
		const { asFragment, getByTestId } = render(
			<table>
				<tbody>
					<AddressRow index={0} maxVotes={1} wallet={wallet} />
					<AddressRow index={1} maxVotes={1} wallet={blankWallet} />
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
					<AddressRow index={0} maxVotes={1} wallet={wallet} />
					<AddressRow index={1} maxVotes={1} wallet={unvotedWallet} />
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
					<AddressRow index={0} maxVotes={1} wallet={wallet} onSelect={onSelect} />
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
