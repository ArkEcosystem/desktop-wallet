import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

const WithProviders = ({ children }: { children: React.ReactNode }) => {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

const customRender = (component, options) => render(component, { wrapper: WithProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
