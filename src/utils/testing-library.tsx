import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { render } from "@testing-library/react";
import { EnvironmentProvider } from "app/contexts";
import { i18n } from "app/i18n";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Router } from "react-router-dom";
import { StubStorage } from "tests/mocks";

import envFixture from "../tests/fixtures/env/data.json";

export const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage(envFixture) });

const WithProviders: React.FC = ({ children }: { children?: React.ReactNode }) => {
	return (
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env}>{children}</EnvironmentProvider>
		</I18nextProvider>
	);
};

const customRender = (component: React.ReactElement, options: any = {}) =>
	render(component, { wrapper: WithProviders, ...options });

const renderWithRouter = (
	component: React.ReactElement,
	{ routes = ["/"], history = createMemoryHistory({ initialEntries: routes }), withProviders = true } = {},
) => {
	const RouterWrapper = ({ children }: { children: React.ReactNode }) =>
		withProviders ? (
			<WithProviders>
				<Router history={history}>{children}</Router>
			</WithProviders>
		) : (
			<Router history={history}>{children}</Router>
		);

	return {
		...customRender(component, { wrapper: RouterWrapper }),
		history,
	};
};

export * from "@testing-library/react";

export { customRender as render, renderWithRouter };
