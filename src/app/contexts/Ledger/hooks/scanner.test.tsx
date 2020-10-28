import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerProvider } from "../Ledger";
import { useLedgerScanner } from "./scanner";

describe("Use Ledger Scanner", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let transport: typeof Transport;
	let publicKeyPaths = new Map();

	beforeAll(() => {
		nock("https://dwallets.ark.io/api")
			.get("/wallets")
			.query((params) => !!params.address)
			.reply(200, {
				meta: {},
				data: [
					{
						address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES",
						balance: "1",
					},
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						balance: "2",
					},
					{
						address: "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve",
						balance: "3",
					},
				],
			})
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));

		publicKeyPaths = new Map([
			["44'/1'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/1'/1'/0/0", wallet.publicKey()!],
			["44'/1'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
			["44'/1'/3'/0/0", "033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200"],
			["44'/1'/4'/0/0", "03d3c6889608074b44155ad2e6577c3368e27e6e129c457418eb3e5ed029544e8d"],
		]);
	});

	it("should render", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { scanMore, wallets, isSelected, isLoading, isFailed } = useLedgerScanner(
				wallet.coinId(),
				wallet.networkId(),
				profile,
			);

			return (
				<div>
					<ul>
						{wallets.map((x) => (
							<li key={x.index}>
								<p>{`Index: ${x.index}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.index)}`}</p>
								<p>{`Selected: ${isSelected(x.index)}`}</p>
								<p>{`Balance: ${isLoading(x.index) ? "Loading" : x.balance?.toFixed()}`}</p>
							</li>
						))}
					</ul>
					<button onClick={scanMore}>Scan</button>
				</div>
			);
		};

		const { container } = render(
			<LedgerProvider transport={transport}>
				<Component />
			</LedgerProvider>,
		);

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(4));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();
	});
});
