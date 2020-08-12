import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { availableNetworksMock } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { Registration } from "./Registration";

export default {
	title: "Domains / Transaction / Pages / Registration",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
};

const defaultFormValues = {
	networks: availableNetworksMock,
	registrationTypes: [
		{
			value: "business",
			label: "Business",
		},
	],
	formDefaultData: {
		network: null,
		address: null,
	},
	wallets,
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/registration`]}>
			<Route
				path="/profiles/:profileId/transactions/registration"
				component={() => <Registration {...defaultFormValues} onDownload={() => alert("download")} />}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);
