import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { fireEvent, render, renderWithRouter, screen, waitFor } from "testing-library";

import { Welcome } from "../Welcome";

let env: Environment;
beforeEach(() => (env = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" })));

describe("Welcome", () => {
	it("should render", async () => {
		const { container, asFragment } = render(
			<EnvironmentContext.Provider value={{ env }}>
				<Welcome />
			</EnvironmentContext.Provider>,
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
		const { container, getByText, asFragment, history } = renderWithRouter(
			<EnvironmentContext.Provider value={{ env }}>
				<Welcome />
			</EnvironmentContext.Provider>,
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
		const createdProfile = env.profiles().create("caio");

		const { container, getByText, asFragment, history } = renderWithRouter(
			<EnvironmentContext.Provider value={{ env }}>
				<Welcome />
			</EnvironmentContext.Provider>,
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
