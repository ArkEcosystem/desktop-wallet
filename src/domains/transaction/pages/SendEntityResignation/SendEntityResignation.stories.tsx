import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendEntityResignation } from "./SendEntityResignation";

export default {
	title: "Domains / Transaction / Pages / SendEntityResignation",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/resignation`]}>
			<Route
				path="/profiles/:profileId/transactions/resignation"
				component={() => <SendEntityResignation onDownload={() => alert("download")} />}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);
