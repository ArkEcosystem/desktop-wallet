import { Profile, ProfileSetting, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import * as Sentry from "@sentry/react";
import { LedgerProvider } from "app/contexts";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, getDefaultWalletId, renderWithRouter, waitFor } from "utils/testing-library";

import { SentryProvider } from "./SentryProvider";
import { SentryRouterWrapper } from "./SentryRouterWrapper";

describe("Sentry Router Wrapper", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let transport: typeof Transport;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());
		transport = createTransportReplayer(RecordStore.fromString(""));
		process.env.REACT_APP_SENTRY_DSN = "https://example.sentry-dsn.com";
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should stop sentry if no profile found", () => {
		const sentryInitSpy = jest.spyOn(Sentry, "init").mockImplementation();

		renderWithRouter(
			<Route path="/profile/create">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: ["/profile/create"],
			},
		);

		expect(sentryInitSpy).toHaveBeenLastCalledWith({ dsn: undefined });
	});

	it("should stop sentry if error reporting is not enabled", () => {
		let calledOptions;
		jest.spyOn(Sentry, "init").mockImplementation((value) => (calledOptions = value));

		renderWithRouter(
			<Route path="/profile/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: [`/profile/${profile.id()}/dashboard`],
			},
		);

		expect(calledOptions).toMatchObject({
			dsn: undefined,
		});
	});

	it("should init sentry if error reporting is enabled", async () => {
		let calledOptions: any;
		jest.spyOn(Sentry, "init").mockImplementation((value) => (calledOptions = value));

		profile.settings().set(ProfileSetting.ErrorReporting, true);

		renderWithRouter(
			<Route path="/profile/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: [`/profile/${profile.id()}/dashboard`],
			},
		);

		await waitFor(() =>
			expect(calledOptions).toMatchObject({
				dsn: "https://example.sentry-dsn.com",
				integrations: expect.anything(),
				tracesSampleRate: expect.anything(),
			}),
		);

		profile.settings().set(ProfileSetting.ErrorReporting, false);
	});

	it("should init sentry only once", () => {
		const sentryInitSpy = jest.spyOn(Sentry, "init").mockImplementation();
		profile.settings().set(ProfileSetting.ErrorReporting, true);

		const Component = () => (
			<>
				<Route path="/profile/:profileId/dashboard">
					<LedgerProvider transport={transport}>
						<SentryProvider>
							<SentryRouterWrapper>
								<h1>Dashboard</h1>
							</SentryRouterWrapper>
						</SentryProvider>
					</LedgerProvider>
				</Route>
			</>
		);

		const { rerender } = renderWithRouter(<Component />, {
			routes: [`/profile/${profile.id()}/dashboard`],
		});

		rerender(<Component />);

		expect(sentryInitSpy).toHaveBeenCalledTimes(1);

		profile.settings().set(ProfileSetting.ErrorReporting, false);
	});

	it("should register current wallet context", async () => {
		const setContextSpy = jest.spyOn(Sentry, "setContext").mockImplementation();

		renderWithRouter(
			<Route path="/profile/:profileId/dashboard/wallet/:walletId">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: [`/profile/${profile.id()}/dashboard/wallet/${wallet.id()}`],
			},
		);

		await waitFor(() =>
			expect(setContextSpy).toHaveBeenCalledWith("wallet", {
				id: "ac38fe6d-4b67-4ef1-85be-17c5f6841129",
				isLedger: false,
				networkId: "ark.devnet",
			}),
		);
	});

	it("should clear wallet context if it does not exist", async () => {
		const setContextSpy = jest.spyOn(Sentry, "setContext").mockImplementation();

		renderWithRouter(
			<Route path="/profile/:profileId/dashboard/wallet/:walletId">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: [`/profile/${profile.id()}/dashboard/wallet/invalid`],
			},
		);

		await waitFor(() => expect(setContextSpy).toHaveBeenCalledWith("wallet", null));
	});

	it("should clear profile context if it does not exist", async () => {
		const setContextSpy = jest.spyOn(Sentry, "setContext").mockImplementation();

		renderWithRouter(
			<Route path="/profile/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<SentryProvider>
						<SentryRouterWrapper>
							<h1>Page</h1>
						</SentryRouterWrapper>
					</SentryProvider>
				</LedgerProvider>
			</Route>,
			{
				routes: [`/profile/invalid/dashboard`],
			},
		);

		await waitFor(() => expect(setContextSpy).toHaveBeenCalledWith("profile", null));
	});
});
