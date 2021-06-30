import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import electron from "electron";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

import { Page } from "./Page";

let profile: Contracts.IProfile;

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

describe("Page", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		history.push(dashboardURL);
	});

	it("should render", () => {
		const sidebar = true;

		const { container, asFragment } = renderWithRouter(<Page title="Test" sidebar={sidebar} />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without sidebar", () => {
		const { container, asFragment } = renderWithRouter(<Page title="Test" />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["Contacts", "Votes", "Settings", "Support"])(
		"should handle '%s' click on user actions dropdown",
		async (label) => {
			const ipcRendererSpy = jest.spyOn(electron.ipcRenderer, "send").mockImplementation();
			const historySpy = jest.spyOn(history, "push").mockImplementation();

			const { getByTestId, findByText } = renderWithRouter(
				<Route path="/profiles/:profileId/dashboard">
					<Page profile={profile} />
				</Route>,
				{
					history,
					routes: [dashboardURL],
				},
			);

			await waitFor(() => {
				expect(() => getByTestId("navbar__useractions")).toBeTruthy();
			});

			const toggle = getByTestId("navbar__useractions");

			act(() => {
				fireEvent.click(toggle);
			});

			expect(await findByText(label)).toBeTruthy();
			fireEvent.click(await findByText(label));

			if (label === "Support") {
				expect(ipcRendererSpy).toHaveBeenCalledWith("open-external", "https://ark.io/contact");
			} else {
				expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/${label.toLowerCase()}`);
			}

			ipcRendererSpy.mockRestore();
			historySpy.mockRestore();
		},
	);

	it("should handle 'Sign Out' click on user actions dropdown", async () => {
		const { getByTestId, findByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Page profile={profile} />
			</Route>,
			{
				history,
				routes: [dashboardURL],
			},
		);

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		await waitFor(() => {
			expect(() => getByTestId("navbar__useractions")).toBeTruthy();
		});

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Sign Out")).toBeTruthy();
		fireEvent.click(await findByText("Sign Out"));

		expect(historySpy).toHaveBeenCalledWith("/");

		historySpy.mockRestore();
	});
});
