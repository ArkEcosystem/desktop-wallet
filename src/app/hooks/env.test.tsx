import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { identity } from "tests/fixtures/identity";
import { renderWithRouter } from "utils/testing-library";

import { useActiveProfile } from "./env";

const TestProfile: React.FC = () => {
	const profile = useActiveProfile();

	if (profile) {
		return <h1>{profile.name()}</h1>;
	}

	return <span>404</span>;
};

describe("useActiveProfile", () => {
	it("should return profile", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<TestProfile />
			</Route>,
			{
				routes: [`/profiles/${identity.profiles.bob.id}`],
			},
		);
		expect(getByText("Bob")).toBeTruthy();
	});

	it("should return 404 when no profile is found", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<TestProfile />
			</Route>,
			{
				routes: [`/profiles/nonexistent-id`],
			},
		);
		expect(getByText("404")).toBeTruthy();
	});

	it("should return 404 when no environment is provided", () => {
		const { getByText } = render(
			<MemoryRouter>
				<TestProfile />
			</MemoryRouter>,
		);
		expect(getByText("404")).toBeTruthy();
	});
});
