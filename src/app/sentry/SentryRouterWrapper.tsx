import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useEffect, useMemo } from "react";
import React from "react";
import { useParams } from "react-router-dom";

import { useSentryContext } from "./SentryProvider";

export const SentryRouterWrapper = ({ children }: { children: React.ReactNode }) => {
	const { env } = useEnvironmentContext();
	const { profileId, walletId } = useParams();
	const { initSentry, stopSentry, setWalletContext } = useSentryContext();

	const profile = useMemo(() => {
		try {
			return env.profiles().findById(profileId);
		} catch {
			stopSentry();
			return;
		}
	}, [env, profileId, stopSentry]);

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

		// TODO: Change to correct key
		const isErrorReportingEnabled = profile.settings().get<boolean>(ProfileSetting.AdvancedMode, false);

		if (isErrorReportingEnabled) {
			initSentry(profile);
			return;
		}

		stopSentry();
	}, [profile, initSentry, stopSentry]);

	useEffect(() => {
		setWalletContext(wallet);
	}, [wallet, setWalletContext]);

	return <>{children}</>;
};
