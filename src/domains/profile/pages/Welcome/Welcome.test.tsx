import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { AppContext, EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "testing-library";

import { Welcome } from "../Welcome";

describe("Welcome", () => {
	const history = createMemoryHistory();

	const env = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });
	const updateAppState = jest.fn();

	it("should render", async () => {
		const { container, asFragment } = render(
			<Router history={history}>
				<EnvironmentContext.Provider value={env}>
					<AppContext.Provider value={{ updateAppState }}>
						<Welcome />
					</AppContext.Provider>
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

	it("should change route to create profile", async () => {
		const { container, getByText, asFragment } = render(
			<Router history={history}>
				<EnvironmentContext.Provider value={env}>
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
		fireEvent.click(getByText("Create Profile"));
		expect(history.location.pathname).toEqual("/profiles/create");
	});

	it("should render with profiles", async () => {
		env.profiles().create("caio");
		const createdProfile = env.profiles().all()[0];

		const { container, getByText, asFragment } = render(
			<Router history={history}>
				<EnvironmentContext.Provider value={env}>
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
		fireEvent.click(getByText("caio"));
		expect(history.location.pathname).toEqual(`/profiles/${createdProfile.id()}/portfolio`);
		expect(asFragment()).toMatchSnapshot();
	});
});
