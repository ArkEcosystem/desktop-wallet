import { ARK } from "@arkecosystem/platform-sdk-ark";
// Contexts
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
// i18n
import { httpClient } from "app/services";
import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from "test-utils";

import { Welcome } from "../Welcome";

describe("Welcome", () => {
	it("should render", async () => {
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

		const { container, asFragment } = render(
			<Router>
				<EnvironmentContext.Provider value={{ env }}>
					<Welcome />
				</EnvironmentContext.Provider>
			</Router>,
		);

		await waitFor(async () => {
			await expect(
				screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with profiles", async () => {
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

		env.profiles().create("caio");

		const { container, asFragment } = render(
			<Router>
				<EnvironmentContext.Provider value={{ env }}>
					<Welcome />
				</EnvironmentContext.Provider>
			</Router>,
		);

		await waitFor(async () => {
			await expect(
				screen.findByText("You already have a profile, you can choose any of them"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
