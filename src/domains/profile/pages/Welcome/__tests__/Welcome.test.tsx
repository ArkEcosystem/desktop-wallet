import { ARK } from "@arkecosystem/platform-sdk-ark";
// Contexts
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { render, screen, waitFor } from "@testing-library/react";
import { EnvironmentContext } from "app/contexts";
// i18n
import { i18n } from "app/i18n";
import { httpClient } from "app/services";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { HashRouter as Router } from "react-router-dom";

import { Welcome } from "../";

describe("Welcome", () => {
	it("should render", async () => {
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

		const { container, asFragment } = render(
			<Router>
				<I18nextProvider i18n={i18n}>
					<EnvironmentContext.Provider value={{ env }}>
						<Welcome />
					</EnvironmentContext.Provider>
				</I18nextProvider>
			</Router>,
		);

		await waitFor(async () => {
			expect(
				await screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with profiles", async () => {
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });
		await env.profiles().create("caio");

		const { container, asFragment } = render(
			<Router>
				<I18nextProvider i18n={i18n}>
					<EnvironmentContext.Provider value={{ env }}>
						<Welcome />
					</EnvironmentContext.Provider>
				</I18nextProvider>
			</Router>,
		);

		await waitFor(async () => {
			expect(
				await screen.findByText("You already have a profile, you can choose any of them"),
			).toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
