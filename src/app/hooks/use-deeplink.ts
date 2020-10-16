import { URI } from "@arkecosystem/platform-sdk-support/dist/uri";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const useDeepLinkHandler = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const uriService = new URI();

	const navigate = useCallback((url: string, deeplinkSchema?: any) => history.push(url, deeplinkSchema), [history]);

	const handler = useCallback(
		(event: any, deeplink: string) => {
			if (deeplink) {
				if (window.location.pathname === "/") return toasts.warning(t("COMMON.SELECT_A_PROFILE"));

				if (window.location.pathname.includes("/dashboard")) return toasts.warning(t("COMMON.SELECT_A_WALLET"));

				const deeplinkSchema = uriService.deserialize(deeplink);
				const urlParts = window.location.pathname.split("/");
				const activeSession = {
					profileId: urlParts[2],
					walletId: urlParts[4],
				};

				switch (deeplinkSchema.method) {
					case "transfer":
						return navigate(
							`/profiles/${activeSession.profileId}/wallets/${activeSession.walletId}/send-transfer`,
							deeplinkSchema,
						);

					default:
						return navigate("/");
				}
			}
		},
		[t, uriService, navigate],
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
