import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { WalletsDecorator } from "utils/storybook";

import { addressListData, delegateListData } from "../../data";
import { Votes } from "./Votes";

export default {
	title: "Domains / Vote / Pages / Votes",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/dashboard`]}>
			<Route
				path="/profiles/:profileId/dashboard"
				component={() => (
					<Votes
						networks={availableNetworksMock}
						addressList={addressListData}
						delegateList={delegateListData}
					/>
				)}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);
