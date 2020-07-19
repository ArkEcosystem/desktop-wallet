import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { render } from "@testing-library/react";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";
import { renderWithRouter } from "utils/testing-library";

import { useActiveProfile, useAvailableNetworks } from "./env";

const TestProfile: React.FC = () => {
	const profile = useActiveProfile();

	if (profile) {
		return <h1>{profile.name()}</h1>;
	}

	return <span>404</span>;
};

const TestNetworks: React.FC = () => {
	const networks = useAvailableNetworks();

	if (networks) {
		return (
			<ul>
				{networks.map((network, index) => (
					<li key={index}>
						{network.ticker} - {network.network}
					</li>
				))}
			</ul>
		);
	}

	return <span>No networks available</span>;
};

let env: Environment;

describe("hooks / env", () => {
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

	describe("useAvailableNetworks", () => {
		beforeEach(() => {
			env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		});

		it("should return networks", () => {
			const { getByText } = render(
				<EnvironmentProvider env={env}>
					<TestNetworks />
				</EnvironmentProvider>,
			);
			expect(getByText("ARK - Mainnet")).toBeTruthy();
			expect(getByText("DARK - Devnet")).toBeTruthy();
		});

		it("should return `no networks available` when no environment is provided", () => {
			const { getByText } = render(<TestNetworks />);
			expect(getByText("No networks available")).toBeTruthy();
		});
	});
});
