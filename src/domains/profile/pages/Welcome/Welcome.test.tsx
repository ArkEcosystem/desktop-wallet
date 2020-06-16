import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
// Contexts
import { EnvironmentProvider } from "app/contexts";
// i18n
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

import { Welcome } from "./";

describe("Welcome", () => {
	it("should render", async () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<EnvironmentProvider>
					<Welcome />
				</EnvironmentProvider>
			</I18nextProvider>,
		);

		await waitFor(async () => {
			expect(
				await screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
