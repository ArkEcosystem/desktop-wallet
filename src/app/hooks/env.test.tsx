import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage.json";
import { env, getDefaultProfileId, renderWithRouter, useDefaultNetMocks } from "utils/testing-library";

import { useActiveProfile } from "./env";

let profile: Profile;

describe("useActiveProfile", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById(getDefaultProfileId());
	});
	const TestProfile: React.FC = () => {
		const profile = useActiveProfile();

		if (profile) {
			return <h1>{profile.name()}</h1>;
		}

		return <span>404</span>;
	};

	it("should return profile", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<TestProfile />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}`],
			},
		);
		expect(getByText(profile.name())).toBeTruthy();
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
});
