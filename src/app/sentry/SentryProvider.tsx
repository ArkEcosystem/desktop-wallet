import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { useCallback, useContext, useRef } from "react";

import { SentryErrorBoundary } from "./SentryErrorBoundary";

const SentryContext = React.createContext<any>(undefined);

const useSentry = () => {
	const initializedProfileReference = useRef<Contracts.IProfile>();

	const setProfileContext = (profile?: Contracts.IProfile) => {
		if (!profile) {
			Sentry.setContext("profile", null);
			return;
		}

		Sentry.setContext("profile", {
			id: profile.id(),
			networkIds: uniq(
				profile
					.wallets()
					.values()
					.map((wallet) => wallet.networkId()),
			),
			settings: {
				advancedMode: profile.settings().get(Contracts.ProfileSetting.AdvancedMode),
				screenshotProtection: profile.settings().get(Contracts.ProfileSetting.ScreenshotProtection),
				signOutPeriod: profile.settings().get(Contracts.ProfileSetting.AutomaticSignOutPeriod),
				useTestNetworks: profile.settings().get(Contracts.ProfileSetting.UseTestNetworks),
			},
			walletsCount: profile.wallets().count(),
		});
	};

	const setWalletContext = (wallet?: Contracts.IReadWriteWallet) => {
		if (!wallet) {
			Sentry.setContext("wallet", null);
			return;
		}

		Sentry.setContext("wallet", {
			id: wallet.id(),
			isLedger: wallet.isLedger(),
			networkId: wallet.networkId(),
		});
	};

	const setLedgerContext = (ledgerData: {
		hasDeviceAvailable: boolean;
		isConnected: boolean;
		isAwaitingConnection: boolean;
	}) => {
		Sentry.setContext("ledger", {
			hasDeviceAvailable: ledgerData.hasDeviceAvailable,
			isAwaitingConnection: ledgerData.isAwaitingConnection,
			isConnected: ledgerData.isConnected,
		});
	};

	const initSentry = (profile: Contracts.IProfile) => {
		if (initializedProfileReference.current?.id() === profile.id()) {
			return;
		}

		initializedProfileReference.current = profile;

		Sentry.init({
			dsn: process.env.REACT_APP_SENTRY_DSN,
			integrations: [new Integrations.BrowserTracing()],
			tracesSampleRate: 1,
		});

		setProfileContext(profile);
		setWalletContext(undefined);
	};

	const stopSentry = useCallback(() => {
		Sentry.init({
			dsn: undefined,
		});
	}, []);

	const captureMessage = (message: string) => {
		Sentry.captureMessage(message);
	};

	const captureException = (error: Error) => {
		Sentry.captureException(error);
	};

	return {
		captureException,
		captureMessage,
		initSentry,
		setLedgerContext,
		setProfileContext,
		setWalletContext,
		stopSentry,
	};
};

export const SentryProvider = ({ children }: { children: React.ReactNode }) => {
	const context = useSentry();

	return (
		<SentryContext.Provider value={context}>
			<SentryErrorBoundary>{children}</SentryErrorBoundary>
		</SentryContext.Provider>
	);
};

export const useSentryContext = (): ReturnType<typeof useSentry> => useContext(SentryContext);
