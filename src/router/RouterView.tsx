import { URIService } from "@arkecosystem/platform-sdk/dist/coins";
import { useEnvironmentContext } from "app/contexts";
import { getDeeplinkRoute, toasts } from "app/services";
import { ipcRenderer } from "electron";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteConfig } from "react-router-config";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { styled } from "twin.macro";

import { Middleware } from "./interfaces";

const Wrapper = styled.div``;

type Props = {
	routes: RouteConfig[];
	wrapper?: React.ElementType;
	middlewares?: Middleware[];
};

export const RouterView = ({ routes, wrapper, middlewares }: Props) => {
	const location = useLocation();
	const { pathname } = location;
	const history = useHistory();
	const { t } = useTranslation();

	const { env } = useEnvironmentContext();
	const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);

	const canActivate = useMemo(
		() =>
			middlewares!.every((middleware) =>
				middleware.handler({ location, env, redirect: setRedirectUrl, history }),
			),
		[location, middlewares, env, history],
	);

	useLayoutEffect(() => {
		ipcRenderer.on("process-url", (_, url) => {
			const uriService = new URIService();
			console.log({ pathname });
			if (pathname === "/") return toasts.warning(t("COMMON.SELECT_A_PROFILE"));

			if (pathname.includes("/dashboard")) return toasts.warning(t("COMMON.SELECT_A_WALLET"));

			const urlParts = pathname.split("/");
			const activeSession = {
				profileId: urlParts[2],
				walletId: urlParts[4],
			};

			const deeplinkSchema = uriService.deserialize(url);

			return history.replace(getDeeplinkRoute(activeSession)[deeplinkSchema.method], deeplinkSchema);
		});
	}, [pathname, history, t]);

	return (
		<Switch>
			{routes.map((route, i) => (
				<Route
					key={i}
					path={route.path}
					render={(props) =>
						canActivate ? (
							<Wrapper data-testid="RouterView__wrapper" as={wrapper}>
								{/* @ts-ignore */}
								<route.component {...props} routes={route.routes} />
							</Wrapper>
						) : (
							<Redirect to={redirectUrl || "/"} />
						)
					}
				/>
			))}
		</Switch>
	);
};

RouterView.defaultProps = {
	middlewares: [],
};
