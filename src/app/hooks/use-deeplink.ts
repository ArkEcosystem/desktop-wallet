import { URI } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import querystring from "querystring";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory } from "react-router-dom";
import { lowerCaseEquals } from "utils/equals";

const useDeepLinkHandler = () => {
	const { env } = useEnvironmentContext();

	const history = useHistory();
	const { t } = useTranslation();
	const [uriService] = useState(() => new URI());

	const allAvailableNetworks = useMemo(() => env.availableNetworks(), [env]);
	const navigate = useCallback((url: string, deeplinkSchema?: any) => history.push(url, deeplinkSchema), [history]);

	/** useActiveProfile has no effect here because it is not within the routes */
	const verifyForProfileSelected = () => {
		const match = matchPath<{ profileId: string }>(history.location.pathname, {
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

					const deeplinkSchema = uriService.deserialize(deeplink);

					if (!profileId) {
						return toasts.warning(t("COMMON.SELECT_A_PROFILE"));
					}

					const profile = env.profiles().findById(profileId);

					/* istanbul ignore next */
					if (
						deeplinkSchema.coin &&
						!allAvailableNetworks.some((item) => lowerCaseEquals(item.coin(), deeplinkSchema.coin))
					) {
						throw new Error(`Coin "${deeplinkSchema.coin}" not supported.`);
					}

					/* istanbul ignore next */
					if (
						deeplinkSchema.network &&
						!allAvailableNetworks.some((item) => lowerCaseEquals(item.id(), deeplinkSchema.network))
					) {
						throw new Error(`Network "${deeplinkSchema.network}" not supported.`);
					}

					const availableWallets = profile
						.wallets()
						.findByCoinWithNetwork(deeplinkSchema.coin.toUpperCase(), deeplinkSchema.network.toLowerCase());

					if (availableWallets.length === 0) {
						throw new Error(
							`The current profile has no wallets available for the "${deeplinkSchema.network}" network`,
						);
					}

					const queryParameters = querystring.encode(deeplinkSchema);

					if (deeplinkSchema.method === "transfer") {
						return navigate(`/profiles/${profileId}/send-transfer?${queryParameters}`);
					}

					return navigate("/");
				} catch (error) {
					toasts.error(`Invalid URI: ${error.message}`);
				}
			}
		},
		[t, uriService, navigate, allAvailableNetworks, env], // eslint-disable-line react-hooks/exhaustive-deps
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
