import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { WalletCard } from "./WalletCard";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${identity.profiles.bob.id}/dashboard`;

describe("Formatted Address", () => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render blank", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard isBlank id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard
					id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					coinIcon="Bitcoin"
					coinClass="border-theme-warning-200"
					avatarId="test"
					walletName="My wallet"
					address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					balance="100,000 BTC"
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard
					id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					coinIcon="Bitcoin"
					coinClass="border-theme-warning-200"
					avatarId="test"
					walletName="My wallet"
					address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					balance="100,000 BTC"
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
