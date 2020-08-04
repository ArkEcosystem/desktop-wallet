import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { RouteConfig } from "react-router-config";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
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
	const { env } = useEnvironmentContext();
	const [redirectUrl, setRedirectUrl] = React.useState<string | undefined>(undefined);

	const canActivate = React.useMemo(
		() => middlewares!.every((middleware) => middleware.handler({ location, env, redirect: setRedirectUrl })),
		[location, middlewares, env],
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
