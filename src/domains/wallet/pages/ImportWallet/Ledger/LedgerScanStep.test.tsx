import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerScanStep } from "./LedgerScanStep";

describe("LedgerScanStep", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let transport: typeof Transport;
	let observer: Observer<any>;
	let publicKeyPaths = new Map();

	beforeAll(() => {
		nock("https://dwallets.ark.io/api")
			.get("/wallets")
			.query((params) => !!params.address)
			.reply(200, {
				meta: {},
				data: [
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

		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("should render", async () => {
		let formRef: ReturnType<typeof useForm>;
		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			formRef = form;

			return (
				<FormProvider {...form}>
					<LedgerProvider transport={transport}>
						<LedgerScanStep profile={profile} />
					</LedgerProvider>
				</FormProvider>
			);
		};

		const { container } = render(<Component />);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(5));
		await waitFor(() => expect(screen.getByText("DJpFwW … DJ28jq")).toBeInTheDocument());

		await waitFor(() => expect(screen.getAllByRole("checkbox")).toHaveLength(5));

		await waitFor(() =>
			expect(formRef.getValues("wallets")).toMatchObject([
				{ address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq", index: 0 },
				{ address: "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve", index: 3 },
			]),
		);

		act(() => {
			fireEvent.click(screen.getAllByRole("checkbox")[1]);
		});

		await waitFor(() =>
			expect(formRef.getValues("wallets")).toMatchObject([
				{ address: "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve", index: 3 },
			]),
		);

		expect(container).toMatchSnapshot();
	});

	it("should handle select", async () => {
		let formRef: ReturnType<typeof useForm>;

		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			formRef = form;

			return (
				<FormProvider {...form}>
					<LedgerProvider transport={transport}>
						<LedgerScanStep profile={profile} />
					</LedgerProvider>
				</FormProvider>
			);
		};

		render(<Component />);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(5), { timeout: 5000 });

		act(() => {
			fireEvent.click(screen.getByTestId("LedgerScanStep__select-all"));
		});

		await waitFor(() => expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(5));

		// Unselect All

		act(() => {
			fireEvent.click(screen.getByTestId("LedgerScanStep__select-all"));
		});

		await waitFor(() => expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(5));

		// Select just first

		act(() => {
			fireEvent.click(screen.getAllByRole("checkbox")[1]);
		});

		await waitFor(() => expect(formRef.getValues("wallets").length).toBe(1));

		act(() => {
			fireEvent.click(screen.getAllByRole("checkbox")[1]);
		});

		await waitFor(() => expect(formRef.getValues("wallets").length).toBe(0));
	});
});
