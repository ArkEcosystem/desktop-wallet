import React from "react";
import { renderRoutes, RouteConfig } from "react-router-config";
import { Switch } from "react-router-dom";
import { styled } from "twin.macro";

const Wrapper = styled.div``;

type Props = {
	routes: RouteConfig[];
	wrapper?: React.ElementType;
};

export const RouterView = ({ routes, wrapper }: Props) => (
	<Switch>
		<Wrapper data-testid="RouterView__wrapper" as={wrapper}>
			{renderRoutes(routes)}
		</Wrapper>
	</Switch>
);
