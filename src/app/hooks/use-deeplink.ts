import { URI } from "@arkecosystem/platform-sdk-support/dist/uri";
import { useEnvironmentContext } from "app/contexts";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory } from "react-router-dom";

const useDeepLinkHandler = () => {
	const { env } = useEnvironmentContext();

	const history = useHistory();
	const { t } = useTranslation();
	const [uriService] = useState(() => new URI());

	const allAvailableNetworks = useMemo(() => env.availableNetworks(), [env]);
	const navigate = useCallback((url: string, deeplinkSchema?: any) => history.push(url, deeplinkSchema), [history]);

	/** useActiveProfile has no effect here because it is not within the routes */
	const verifyForProfileSelected = () => {
		const match = matchPath<{ profileId: string }>(window.location.pathname, {
			path: "/profiles/:profileId",
		});

		if (!match) {
			return false;
		}

		const { profileId } = match.params;
		if (profileId === "create") {
			return false;
		}

		return profileId;
	};

	const handler = useCallback(
		(event: any, deeplink: string) => {
			if (deeplink) {
				try {
					const profileId = verifyForProfileSelected();

					if (!profileId) {
						return toasts.warning(t("COMMON.SELECT_A_PROFILE"));
					}

					const deeplinkSchema = uriService.deserialize(deeplink);

					const profile = env.profiles().findById(profileId);

					/* istanbul ignore next */
					if (deeplinkSchema.coin) {
						if (!allAvailableNetworks.some((item) => item.coin().toLowerCase() === deeplinkSchema.coin)) {
							throw new Error(`Coin "${deeplinkSchema.coin}" not supported.`);
						}
					}

					/* istanbul ignore next */
					if (deeplinkSchema.network) {
						if (!allAvailableNetworks.some((item) => item.id().toLowerCase() === deeplinkSchema.network)) {
							throw new Error(`Network "${deeplinkSchema.network}" not supported.`);
						}
					}

					const availableWallets = profile
						.wallets()
						.findByCoinWithNetwork(deeplinkSchema.coin.toUpperCase(), deeplinkSchema.network);

					if (availableWallets.length === 0) {
						throw new Error(
							`The current profile has no wallets available for the "${deeplinkSchema.network}" network`,
						);
					}

					if (deeplinkSchema.method === "transfer") {
						return navigate(`/profiles/${profileId}/send-transfer`, deeplinkSchema);
					}

					return navigate("/");
				} catch (e) {
					toasts.error(`Invalid URI: ${e.message}`);
				}
			}
		},
		[t, uriService, navigate, allAvailableNetworks, env],
	);

	useEffect((): any => {
		ipcRenderer.on("process-url", handler);

		return () => ipcRenderer.removeListener("process-url", handler);
	}, [handler]);

	return {
		handler,
	};
};

export const useDeeplink = () => {
	const { handler } = useDeepLinkHandler();

	useEffect(() => {
		handler(null, "");
	}, [handler]);
};

export default useDeeplink;
