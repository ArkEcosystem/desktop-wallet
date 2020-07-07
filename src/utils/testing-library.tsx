import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Router } from "react-router-dom";

const WithProviders = ({ children }: { children: React.ReactNode }) => {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

const customRender = (component: React.ReactElement, options: any) =>
	render(component, { wrapper: WithProviders, ...options });

const renderWithRouter = (
	component: React.ReactElement,
	{ routes = ["/"], history = createMemoryHistory({ initialEntries: routes }) } = {},
) => {
	const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
		<Router history={history}>{children}</Router>
	);

	return {
		...customRender(component, { wrapper: RouterWrapper }),
		history,
	};
};

export * from "@testing-library/react";

export { customRender as render, renderWithRouter };
