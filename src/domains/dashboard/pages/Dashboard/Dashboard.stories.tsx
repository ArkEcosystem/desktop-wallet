import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { balances, networks, portfolioPercentages } from "../../data";
import { Dashboard } from "./Dashboard";

export default {
	title: "Domains / Dashboard / Pages / Dashboard",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/dashboard`]}>
			<Route
				path="/profiles/:profileId/dashboard"
				component={() => (
					<Dashboard balances={balances} networks={networks} portfolioPercentages={portfolioPercentages} />
				)}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);

export const FewerWallets = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/dashboard`]}>
			<Route
				path="/profiles/:profileId/dashboard"
				component={() => (
					<Dashboard balances={balances} networks={networks} portfolioPercentages={portfolioPercentages} />
				)}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);

export const Empty = ({ env }: { env: Environment }) => (
	<EnvironmentProvider env={env}>
		<Dashboard networks={networks} portfolioPercentages={portfolioPercentages} />
	</EnvironmentProvider>
);
