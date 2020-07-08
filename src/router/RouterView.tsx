import React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import { styled } from "twin.macro";

const Wrapper = styled.div``;

type Props = {
	routes: RouteConfig[];
	wrapper?: React.ElementType;
};

export const RouterView = ({ routes, wrapper }: Props) => {
	return (
		<Switch>
			{routes.map((route, i) => (
				<Route
					key={i}
					path={route.path}
					render={(props) => (
						<Wrapper data-testid="RouterView__wrapper" as={wrapper}>
							{/* @ts-ignore */}
							<route.component {...props} routes={route.routes} />
						</Wrapper>
					)}
				/>
			))}
		</Switch>
	);
};
