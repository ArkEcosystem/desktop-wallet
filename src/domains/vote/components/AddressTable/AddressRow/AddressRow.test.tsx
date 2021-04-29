/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
// @README: This import is fine in tests but should be avoided in production code.
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles/dist/drivers/memory/wallets/read-only-wallet";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates, waitFor } from "testing-library";
import { data } from "tests/fixtures/coins/ark/devnet/delegates.json";
import walletMock from "tests/fixtures/coins/ark/devnet/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";

import { AddressRow } from "./AddressRow";

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
let blankWallet: Contracts.IReadWriteWallet;
let unvotedWallet: Contracts.IReadWriteWallet;

let emptyProfile: Contracts.IProfile;
let wallet2: Contracts.IReadWriteWallet;

const blankWalletPassphrase = "power return attend drink piece found tragic fire liar page disease combine";

describe("AddressRow", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(Contracts.WalletFlag.Starred, true);
		wallet.data().set(Contracts.WalletData.LedgerPath, "0");

		blankWallet = await profile.walletFactory().fromMnemonic({
			mnemonic: blankWalletPassphrase,
			coin: "ARK",
			network: "ark.devnet",
		});
		profile.wallets().push(blankWallet);

		unvotedWallet = await profile.walletFactory().fromMnemonic({
			mnemonic: "unvoted wallet",
			coin: "ARK",
			network: "ark.devnet",
		});
		profile.wallets().push(unvotedWallet);

		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");

		wallet2 = await emptyProfile.walletFactory().fromMnemonic({
			mnemonic: "wallet 2",
			coin: "ARK",
			network: "ark.devnet",
		});
		profile.wallets().push(wallet2);

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
		await wallet.synchroniser().votes();
		await wallet.synchroniser().identity();
		await wallet.synchroniser().coin();
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

	it("should render when the maximum votes is greater than 1", () => {
		const votesMock = jest.spyOn(wallet.voting(), "current").mockReturnValue(
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
		const votesMock = jest.spyOn(wallet.voting(), "current").mockReturnValue(
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
		await wallet.synchroniser().identity();
		await wallet.synchroniser().votes();
		await wallet.synchroniser().coin();

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
