/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env,getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("Dashboard", () => {
	it("should sync profile", async () => {
		history.push(dashboardURL);
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileSynced">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => {
			expect(getByTestId("ProfileSynced")).toBeInTheDocument();
		});
	});

	it("should not sync if not in profile's url", async () => {
		history.push("/");

		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				routes: ["/"],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => {
			expect(getByTestId("RenderedContent")).toBeInTheDocument();
		});
	});

	it("should sync only valid profiles from url", async () => {
		history.push("/profiles/invalidId/dashboard");

		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				routes: ["/profiles/:profileId/dashboard"],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => {
			expect(getByTestId("RenderedContent")).toBeInTheDocument();
		});
	});

	it("should restore profile", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";
		history.push(dashboardURL);

		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => {
			expect(getByTestId("ProfileRestored")).toBeInTheDocument();
		});
	});
});
