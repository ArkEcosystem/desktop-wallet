import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendIPFSTransaction } from "./SendIPFSTransaction";

export default {
	title: "Domains / Transaction / Pages / SendIPFSTransaction",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/ipfs`]}>
			<Route
				path="/profiles/:profileId/transactions/ipfs"
				component={() => <SendIPFSTransaction networks={availableNetworksMock} />}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);
