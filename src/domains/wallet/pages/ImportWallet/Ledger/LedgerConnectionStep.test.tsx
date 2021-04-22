import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { EnvironmentProvider } from "app/contexts";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { createMemoryHistory } from "history";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

const history = createMemoryHistory();

import { LedgerConnectionStep } from "./LedgerConnectionStep";

let transport: typeof Transport;
let observer: Observer<any>;

describe("LedgerConnectionStep", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await profile.restore();
		await profile.sync();

		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));

		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		jest.useFakeTimers();
		jest.spyOn(wallet.coin(), "__construct").mockImplementation();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("should emit event on fail", async () => {
		jest.setTimeout(10000);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockRejectedValue(new Error("Failed"));

		const onFailed = jest.fn();

		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			return (
				<EnvironmentProvider env={env}>
					<FormProvider {...form}>
						<LedgerProvider transport={transport}>
							<LedgerConnectionStep onFailed={onFailed} />
						</LedgerProvider>
					</FormProvider>
				</EnvironmentProvider>
			);
		};

		history.push(`/profiles/${profile.id()}`);

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<Component />
			</Route>,
			{ history, withProviders: false },
		);

		await waitFor(() => expect(screen.queryByText("Open the ARK app on your device ...")).toBeInTheDocument());

		await waitFor(() => expect(onFailed).toHaveBeenCalled(), { timeout: 10000 });
		await waitFor(() => expect(screen.queryByText("Failed")).toBeInTheDocument());

		expect(container).toMatchSnapshot();

		getPublicKeySpy.mockReset();
	});

	it("should emit event on connect", async () => {
		const publicKeyPaths = new Map([
			["44'/111'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/111'/1'/0/0", wallet.publicKey()!],
			["44'/111'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
		]);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue(publicKeyPaths.values().next().value);

		const onConnect = jest.fn();

		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			return (
				<EnvironmentProvider env={env}>
					<FormProvider {...form}>
						<LedgerProvider transport={transport}>
							<LedgerConnectionStep onConnect={onConnect} />
						</LedgerProvider>
					</FormProvider>
				</EnvironmentProvider>
			);
		};

		history.push(`/profiles/${profile.id()}`);
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<Component />
			</Route>,
			{ history, withProviders: false },
		);

		await waitFor(() => expect(screen.getByText("Successfully connected")).toBeInTheDocument());
		await waitFor(() => expect(onConnect).toHaveBeenCalled());

		expect(container).toMatchSnapshot();

		getPublicKeySpy.mockReset();
	});
});
