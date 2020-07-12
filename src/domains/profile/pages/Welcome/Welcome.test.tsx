import React from "react";
import { fireEvent, renderWithRouter, screen, waitFor } from "testing-library";
import { identity } from "tests/fixtures/identity";
import { env } from "utils/testing-library";

import { Welcome } from "../Welcome";

describe("Welcome", () => {
	it("should render without environment", () => {
		const { queryByText } = renderWithRouter(<Welcome />, {
			withProviders: false,
		});
		expect(queryByText("Select Profile")).toBeNull();
	});

	it("should render with profiles", async () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);
		const profile = env.profiles().get(identity.profiles.bob.id);

		await waitFor(async () => {
			await expect(
				screen.findByText("You already have a profile, you can choose any of them"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		fireEvent.click(getByText(profile.name()));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without profiles", async () => {
		const { container, asFragment } = renderWithRouter(<Welcome />, { withProviders: false });

		await waitFor(async () => {
			await expect(
				screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change route to create profile", async () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />, { withProviders: false });

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
});
