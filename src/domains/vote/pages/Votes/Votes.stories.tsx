import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { WalletsDecorator } from "utils/storybook";

import { Votes } from "./Votes";

export default {
	title: "Domains / Vote / Pages / Votes",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/votes`]}>
			<Route path="/profiles/:profileId/votes" component={() => <Votes />} />
		</MemoryRouter>
	</EnvironmentProvider>
);
