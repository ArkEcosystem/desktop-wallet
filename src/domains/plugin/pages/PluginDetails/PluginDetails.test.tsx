import { Profile } from "@arkecosystem/platform-sdk-profiles";
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
});
