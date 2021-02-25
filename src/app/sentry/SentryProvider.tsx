import { Profile, ProfileSetting, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { useCallback, useContext, useRef } from "react";

import { SentryErrorBoundary } from "./SentryErrorBoundary";

const SentryContext = React.createContext<any>(undefined);

const useSentry = () => {
	const initializedProfileRef = useRef<Profile>();

	const setProfileContext = (profile?: Profile) => {
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
				screenshotProtection: profile.settings().get(ProfileSetting.ScreenshotProtection),
				advancedMode: profile.settings().get(ProfileSetting.AdvancedMode),
				signOutPeriod: profile.settings().get(ProfileSetting.AutomaticSignOutPeriod),
				useTestNetworks: profile.settings().get(ProfileSetting.UseTestNetworks),
			},
			walletsCount: profile.wallets().count(),
		});
	};

	const setWalletContext = (wallet?: ReadWriteWallet) => {
		if (!wallet) {
			Sentry.setContext("wallet", null);
			return;
		}

		Sentry.setContext("wallet", {
			id: wallet.id(),
			networkId: wallet.networkId(),
			isLedger: wallet.isLedger(),
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

	const initSentry = (profile: Profile) => {
		if (initializedProfileRef.current?.id() === profile.id()) {
			return;
		}

		initializedProfileRef.current = profile;

		Sentry.init({
			dsn: process.env.REACT_APP_SENTRY_DSN,
			integrations: [new Integrations.BrowserTracing()],
			tracesSampleRate: 1.0,
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

	const captureException = (err: Error) => {
		Sentry.captureException(err);
	};

	return {
		captureException,
		captureMessage,
		initSentry,
		stopSentry,
		setLedgerContext,
		setProfileContext,
		setWalletContext,
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
