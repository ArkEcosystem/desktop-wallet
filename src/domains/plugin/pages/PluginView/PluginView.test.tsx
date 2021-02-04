import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { ipcRenderer } from "electron";
import { LaunchPluginService, PluginManagerProvider } from "plugins";
import { PluginController, PluginManager } from "plugins/core";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { PluginView } from "./PluginView";

describe("Plugin View", () => {
	let manager: PluginManager;
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
		manager.services().register([new LaunchPluginService()]);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should render plugin content", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { permissions: ["LAUNCH"] } },
			(api) => api.launch().render(<h1>My Plugin View</h1>),
		);

		manager.plugins().push(plugin);

		plugin.enable(profile, { autoRun: true });

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/view">
				<PluginManagerProvider manager={manager} services={[]}>
					<PluginView />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/view?pluginId=${plugin.config().id()}`],
			},
		);

		await waitFor(() => expect(screen.queryByText("My Plugin View")).toBeInTheDocument());

		expect(container).toMatchSnapshot();

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should render plugin content with logo", async () => {
		const plugin = new PluginController(
			{
				name: "new-plugin",
				"desktop-wallet": {
					logo: "https://raw.githubusercontent.com/new-plugin/master/logo.png",
					permissions: ["LAUNCH"],
				},
			},
			(api) => api.launch().render(<h1>My Plugin View</h1>),
		);

		manager.plugins().push(plugin);

		plugin.enable(profile, { autoRun: true });

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/view">
				<PluginManagerProvider manager={manager} services={[]}>
					<PluginView />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/view?pluginId=${plugin.config().id()}`],
			},
		);

		await waitFor(() => expect(screen.queryByTestId("PluginView__logo")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should uninstall plugin", async () => {
		const plugin = new PluginController(
			{
				name: "test-plugin",
			},
			() => void 0,
		);

		manager.plugins().push(plugin);

		const { history } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/view">
				<PluginManagerProvider manager={manager} services={[]}>
					<PluginView />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/view?pluginId=${plugin.config().id()}`],
			},
		);

		await waitFor(() => expect(screen.queryAllByText("Test Plugin").length).toBeGreaterThan(0));

		fireEvent.click(screen.getByTestId("PluginView__uninstall"));

		await waitFor(() => expect(screen.getByTestId("PluginUninstallConfirmation")));

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(manager.plugins().findById(plugin.config().id())).toBeUndefined());
		await waitFor(() => expect(history.location.pathname).toBe(`/profiles/${profile.id()}/plugins`));

		invokeMock.mockRestore();
	});
});
