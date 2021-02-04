import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { ipcRenderer } from "electron";
import nock from "nock";
import { PluginController, PluginManager, PluginManagerProvider, usePluginManagerContext } from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
	let manager: PluginManager;
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should render properly", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { categories: ["exchange"] } },
			() => void 0,
		);

		manager.plugins().push(plugin);

		const FetchComponent = () => {
			const { fetchPluginPackages } = usePluginManagerContext();
			return <button onClick={fetchPluginPackages}>Fetch Packages</button>;
		};

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/details?pluginId=${plugin.config().id()}`],
			},
		);

		fireEvent.click(screen.getByText("Fetch Packages"));

		await waitFor(() => expect(screen.getAllByText("Test Plugin").length).toBeGreaterThan(0));
		expect(container).toMatchSnapshot();
	});

	it("should render properly for remote package", async () => {
		nock("https://github.com/")
			.get("/arkecosystem/remote-plugin/raw/master/package.json")
			.reply(200, { name: "remote-plugin" });

		const FetchComponent = () => {
			const { fetchLatestPackageConfiguration } = usePluginManagerContext();
			return (
				<button
					onClick={() => fetchLatestPackageConfiguration("https://github.com/arkecosystem/remote-plugin")}
				>
					Fetch Package
				</button>
			);
		};

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/details?pluginId=remote-plugin`],
			},
		);

		fireEvent.click(screen.getByText("Fetch Package"));

		await waitFor(() => expect(screen.getAllByText("Remote Plugin").length).toBeGreaterThan(0));

		expect(container).toMatchSnapshot();
	});

	it("should show configuration for plugins from npm", async () => {
		nock("https://registry.npmjs.com")
			.get("/-/v1/search")
			.query((params) => params.from === "0")
			.once()
			.reply(200, require("tests/fixtures/plugins/registry-response.json"))
			.get("/-/v1/search")
			.query((params) => params.from === "250")
			.once()
			.reply(200, {})
			.persist();

		nock("https://raw.github.com")
			.get("/dated/transaction-export-plugin/master/package.json")
			.reply(200, {
				name: "@dated/transaction-export-plugin",
				"desktop-wallet": { title: "My Export Transaction" },
			});

		const FetchComponent = () => {
			const { fetchPluginPackages } = usePluginManagerContext();
			return <button onClick={fetchPluginPackages}>Fetch Packages</button>;
		};

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/details?pluginId=@dated/transaction-export-plugin`],
			},
		);

		fireEvent.click(screen.getByText("Fetch Packages"));

		await waitFor(() => expect(screen.getAllByText("My Export Transaction").length).toBeGreaterThan(0));

		expect(container).toMatchSnapshot();
	});

	it("should remove package", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { categories: ["exchange"] } },
			() => void 0,
		);

		manager.plugins().push(plugin);

		const FetchComponent = () => {
			const { fetchPluginPackages } = usePluginManagerContext();
			return <button onClick={fetchPluginPackages}>Fetch Packages</button>;
		};

		const { history } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/details?pluginId=${plugin.config().id()}`],
			},
		);

		fireEvent.click(screen.getByText("Fetch Packages"));

		await waitFor(() => expect(screen.getAllByText("Test Plugin").length).toBeGreaterThan(0));

		fireEvent.click(screen.getByTestId("PluginHeader__button--uninstall"));
		await waitFor(() => expect(screen.getByTestId("PluginUninstallConfirmation")));

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(manager.plugins().findById(plugin.config().id())).toBeUndefined());
		await waitFor(() => expect(history.location.pathname).toBe(`/profiles/${profile.id()}/plugins`));

		invokeMock.mockRestore();
	});

	it("should install package", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:loader-fs.find") {
				return {
					config: { name: "remote-plugin", version: "0.0.1" },
					source: () => void 0,
					sourcePath: "/plugins/remote-plugin/index.js",
					dir: "/plugins/remote-plugin",
				};
			}

			if (channel === "plugin:download") {
				return "/plugins/remote-plugin";
			}
		});

		nock("https://github.com/")
			.get("/arkecosystem/remote-plugin/raw/master/package.json")
			.reply(200, { name: "remote-plugin" });

		const FetchComponent = () => {
			const { fetchLatestPackageConfiguration } = usePluginManagerContext();
			return (
				<button
					onClick={() => fetchLatestPackageConfiguration("https://github.com/arkecosystem/remote-plugin")}
				>
					Fetch
				</button>
			);
		};

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [
					`/profiles/${profile.id()}/plugins/details?pluginId=remote-plugin&repositoryURL=https://github.com/arkecosystem/remote-plugin`,
				],
			},
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() => expect(screen.getAllByText("Remote Plugin").length).toBeGreaterThan(0));

		fireEvent.click(screen.getByTestId("PluginHeader__button--install"));

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "remote-plugin",
				url: "https://github.com/arkecosystem/remote-plugin/archive/master.zip",
			}),
		);

		await waitFor(() => expect(manager.plugins().findById("remote-plugin")).toBeTruthy());
	});
});
