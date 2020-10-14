import { useEnvironmentContext } from "app/contexts";
import React, { useMemo, useState } from "react";
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
	const history = useHistory();
	const { env } = useEnvironmentContext();
	const [redirectUrl, setRedirectUrl] = React.useState<string | undefined>(undefined);
	const [previousPathname, setPreviousPathname] = React.useState("");

	React.useEffect(() => {
		const pathname = (location as any).location?.pathname || location.pathname;

		if (pathname !== previousPathname) {
			window.scrollTo(0, 0);
		}

		setPreviousPathname(pathname);
	}, [location, previousPathname]);

	const canActivate = useMemo(
		() =>
			middlewares!.every((middleware) =>
				middleware.handler({ location, env, redirect: setRedirectUrl, history }),
			),
		[location, middlewares, env, history],
	);

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
