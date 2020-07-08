import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { fireEvent, render, renderWithRouter, screen, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { Welcome } from "../Welcome";

describe("Welcome", () => {
	it("should render", async () => {
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const { container, asFragment } = render(
			<EnvironmentContext.Provider value={env}>
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
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const { container, getByText, asFragment, history } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
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
		const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		env.profiles().create("Anne Doe");
		const createdProfile = env.profiles().all()[0];

		const { container, getByText, asFragment, history } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Welcome />
			</EnvironmentContext.Provider>,
		);

		await waitFor(async () => {
			await expect(
				screen.findByText("You already have a profile, you can choose any of them"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Anne Doe"));
		expect(history.location.pathname).toEqual(`/profiles/${createdProfile.id()}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});
});
