import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendVoteTransaction } from "./SendVoteTransaction";

export default {
	title: "Domains / Transaction / Pages / SendVoteTransaction",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/vote`]}>
			<Route path="/profiles/:profileId/transactions/vote" component={() => <SendVoteTransaction />} />
		</MemoryRouter>
	</EnvironmentProvider>
);
