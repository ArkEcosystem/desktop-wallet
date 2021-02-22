import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useEffect, useMemo } from "react";
import React from "react";
import { useParams } from "react-router-dom";

import { useSentryContext } from "./SentryProvider";

export const SentryRouterWrapper = ({ children }: { children: React.ReactNode }) => {
	const context = useEnvironmentContext();
	const { profileId, walletId } = useParams();
	const { initSentry, stopSentry, setWalletContext, setLedgerContext } = useSentryContext();
	const { isConnected, isAwaitingConnection, hasDeviceAvailable } = useLedgerContext();

	const profile = useMemo(() => {
		try {
			return context.env.profiles().findById(profileId);
		} catch {
			stopSentry();
			return;
		}
	}, [context, profileId, stopSentry]);

	const wallet = useMemo(() => {
		if (!walletId) {
			return;
		}

		try {
			return profile?.wallets().findById(walletId);
		} catch {
			return;
		}
	}, [profile, walletId]);

	useEffect(() => {
		if (!profile) {
			return;
		}
		// @ts-ignore
		const isErrorReportingEnabled = profile.settings().get<boolean>(ProfileSetting.ErrorReporting, false);

		if (isErrorReportingEnabled) {
			initSentry(profile);
			return;
		}

		stopSentry();
	}, [profile, initSentry, stopSentry]);

	useEffect(() => {
		setWalletContext(wallet);
	}, [wallet, setWalletContext]);

	useEffect(() => {
		setLedgerContext({ isAwaitingConnection, hasDeviceAvailable, isConnected });
	}, [setLedgerContext, isAwaitingConnection, hasDeviceAvailable, isConnected]);

	return <>{children}</>;
};
