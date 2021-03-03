import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";
import React, { useEffect } from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerProvider, useLedgerContext } from "../Ledger";
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
			.get("/wallets")
			.query((params) => !!params.address)
			.reply(200, {
				meta: {},
				data: [],
			});
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));

		publicKeyPaths = new Map([
			["44'/1'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/1'/0'/0/1", "03d3fdad9c5b25bf8880e6b519eb3611a5c0b31adebc8455f0e096175b28321aff"],
			["44'/1'/0'/0/2", "025f81956d5826bad7d30daed2b5c8c98e72046c1ec8323da336445476183fb7ca"],
			["44'/1'/0'/0/3", "024d5eacc5e05e1b05c476b367b7d072857826d9b271e07d3a3327224db8892a21"],
			["44'/1'/0'/0/4", "025d7298a7a472b1435e40df13491e98609b9b555bf3ef452b2afea27061d11235"],

			["44'/1'/1'/0/0", wallet.publicKey()!],
			["44'/1'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
			["44'/1'/3'/0/0", "033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200"],
			["44'/1'/4'/0/0", "03d3c6889608074b44155ad2e6577c3368e27e6e129c457418eb3e5ed029544e8d"],
			["44'/1'/5'/0/0", "02ac8d84d81648154f79ba64fbf64cd6ee60f385b2aa52e8eb72bc1374bf55a68c"],
			["44'/1'/6'/0/0", "032cfbb18f4e49952c6d6475e8adc6d0cba00b81ef6606cc4927b78c6c50558beb"],
			["44'/1'/7'/0/0", "0242555e90957de10e3912ce8831bcc985a40a645447dbfe8a0913ee6d89914707"],
			["44'/1'/8'/0/0", "02677f73453da6073f5cf76db8f65fabc1a3b7aadc7b06027e0df709f14e097790"],
			["44'/1'/9'/0/0", "03f3512aa9717b2ca83d371ed3bb2d3ff922969f3ceef92f65c060afa2bc2244fb"],
			["44'/1'/10'/0/0", "0349e7e2afb470994a8323e9623a6dab227c69d5f09f1a59991fd92880123ffe75"],
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
							<li key={x.path}>
								<p>{`Path: ${x.path}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.path)}`}</p>
								<p>{`Selected: ${isSelected(x.path)}`}</p>
								<p>{`Balance: ${isLoading(x.path) ? "Loading" : x.balance?.toFixed()}`}</p>
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

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(3));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();

		// Fetch more
		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(7));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));
	});

	it("should render with toggleSelect", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { toggleSelect, wallets, scanMore, isFailed, isSelected } = useLedgerScanner(
				wallet.coinId(),
				wallet.networkId(),
				profile,
			);

			return (
				<div>
					<ul>
						{wallets.map((x, i) => (
							<li key={x.path}>
								<p>{`Path: ${x.path}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.path)}`}</p>
								<p>{`Selected: ${isSelected(x.path)}`}</p>
								<input
									type="checkbox"
									data-testid={`input--${i}`}
									onChange={toggleSelect.bind(null, x.path)}
								/>
							</li>
						))}
					</ul>
					<button data-testid="scan" onClick={scanMore}>
						Scan
					</button>
				</div>
			);
		};

		const { container, getByTestId } = render(
			<LedgerProvider transport={transport}>
				<Component />
			</LedgerProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("scan"));
		});

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		act(() => {
			fireEvent.click(getByTestId("input--0"));
		});

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(3));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();
	});

	it("should render with toggleSelectAll", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { toggleSelectAll, wallets, isSelected, isLoading, isFailed } = useLedgerScanner(
				wallet.coinId(),
				wallet.networkId(),
				profile,
			);

			return (
				<div>
					<ul>
						{wallets.map((x) => (
							<li key={x.path}>
								<p>{`Path: ${x.path}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.path)}`}</p>
								<p>{`Selected: ${isSelected(x.path)}`}</p>
								<p>{`Balance: ${isLoading(x.path) ? "Loading" : x.balance?.toFixed()}`}</p>
							</li>
						))}
					</ul>
					<button onClick={toggleSelectAll}>Scan</button>
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

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();
	});

	it("should render with scanRetry", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { scanRetry, wallets, isSelected, isLoading, isFailed } = useLedgerScanner(
				wallet.coinId(),
				wallet.networkId(),
				profile,
			);

			return (
				<div>
					<ul>
						{wallets.map((x) => (
							<li key={x.path}>
								<p>{`Path: ${x.path}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.path)}`}</p>
								<p>{`Selected: ${isSelected(x.path)}`}</p>
								<p>{`Balance: ${isLoading(x.path) ? "Loading" : x.balance?.toFixed()}`}</p>
							</li>
						))}
					</ul>
					<button onClick={scanRetry}>Scan</button>
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

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();
	});

	it("should dispatch failed", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { scanMore, isFailed, wallets } = useLedgerScanner("null", wallet.networkId(), profile);

			return (
				<div>
					<ul>
						{wallets.map((x) => (
							<li key={x.path}>
								<p>{`Path: ${x.path}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Address: ${x.address}`}</p>
								<p>{`Failed: ${isFailed(x.path)}`}</p>
							</li>
						))}
					</ul>
					<button data-testid="scan" onClick={scanMore}>
						Scan
					</button>
				</div>
			);
		};

		const { container, getByTestId } = render(
			<LedgerProvider transport={transport}>
				<Component />
			</LedgerProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("scan"));
		});

		await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByText("Balance: Loading")).toHaveLength(0));

		expect(container).toMatchSnapshot();
	});

	it("should abort scanner", async () => {
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const Component = () => {
			const { isBusy } = useLedgerContext();
			const { scanMore, abortScanner } = useLedgerScanner(wallet.coinId(), wallet.networkId(), profile);

			return (
				<div>
					<p>{isBusy ? "Busy" : "Idle"}</p>
					<button data-testid="scan" onClick={scanMore}>
						Scan
					</button>
					<button data-testid="abort" onClick={abortScanner}>
						Abort
					</button>
				</div>
			);
		};

		const { container } = render(
			<LedgerProvider transport={transport}>
				<Component />
			</LedgerProvider>,
		);

		fireEvent.click(screen.getByTestId("scan"));
		fireEvent.click(screen.getByTestId("abort"));

		await waitFor(() => expect(screen.getByText("Idle")).toBeInTheDocument());
		await new Promise((resolve) => setTimeout(resolve, 3000));

		expect(container).toMatchSnapshot();
	});

	it("should scan until new", async () => {
		nock.cleanAll();

		nock("https://dwallets.ark.io/api")
			.get("/wallets")
			.query((params) => !!params.address)
			.reply(200, {
				meta: {},
				data: [],
			})
			.persist();

		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		await profile.wallets().importByAddress("DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq", "ARK", "ark.devnet");
		await profile.wallets().importByAddress("DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", "ARK", "ark.devnet");
		await profile.wallets().importByAddress("DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve", "ARK", "ark.devnet");
		await profile.wallets().importByAddress("DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T", "ARK", "ark.devnet");

		const Component = () => {
			const { scanUntilNewOrFail, wallets } = useLedgerScanner(wallet.coinId(), wallet.networkId(), profile);

			useEffect(() => {
				scanUntilNewOrFail();
			}, [scanUntilNewOrFail]);

			return (
				<div>
					{wallets.map((wallet) => (
						<span key={wallet.path}>{wallet.address}</span>
					))}
				</div>
			);
		};

		render(
			<LedgerProvider transport={transport}>
				<Component />
			</LedgerProvider>,
		);

		await waitFor(() => expect(screen.queryByText("DJJWYQwyRnch1ZTeDHp1PGLZmGTb1uP7u9")).toBeInTheDocument());
	});
});
