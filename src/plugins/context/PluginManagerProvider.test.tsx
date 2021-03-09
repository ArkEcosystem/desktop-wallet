import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import electron, { ipcRenderer } from "electron";
import nock from "nock";
import { PluginController, PluginManager } from "plugins/core";
import { PluginConfigurationData } from "plugins/core/configuration";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { PluginManagerProvider, usePluginManagerContext } from "./PluginManagerProvider";

describe("PluginManagerProvider", () => {
	let manager: PluginManager;
	let profile: Profile;

	beforeAll(() => {
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
			.reply(200, require("tests/fixtures/plugins/registry/@dated/transaction-export-plugin.json"))
			.get("/dated/delegate-calculator-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/delegate-calculator-plugin.json"))
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should load plugins", () => {
		const invokeMock = jest.spyOn(electron.ipcRenderer, "invoke").mockResolvedValue([]);

		const Component = () => {
			const { loadPlugins } = usePluginManagerContext();
			const onClick = () => loadPlugins();
			return <button onClick={onClick}>Click</button>;
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		expect(invokeMock).toHaveBeenCalledWith("plugin:loader-fs.search");
	});

	it("should report plugin", () => {
		const ipcRendererMock = jest.spyOn(electron.ipcRenderer, "send").mockImplementation();

		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);

		const Component = () => {
			const { reportPlugin } = usePluginManagerContext();
			const onClick = () => reportPlugin(plugin.config());
			return <button onClick={onClick}>Click</button>;
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		expect(ipcRendererMock).toHaveBeenCalledWith(
			"open-external",
			"https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test-plugin&plugin_version=0.0.0",
		);
		ipcRendererMock.mockRestore();
	});

	it("should delete plugin", async () => {
		const invokeMock = jest.spyOn(electron.ipcRenderer, "invoke").mockResolvedValue([]);

		const plugin = new PluginController({ name: "test-plugin" }, () => void 0, "/plugins/example");

		const Component = () => {
			const { deletePlugin } = usePluginManagerContext();
			const onClick = () => deletePlugin(plugin, profile);
			return <button onClick={onClick}>Click</button>;
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		expect(invokeMock).toHaveBeenLastCalledWith("plugin:loader-fs.remove", "/plugins/example");

		await waitFor(() => expect(screen.getByRole("button")).toBeTruthy());
	});

	it("should fetch packages", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		plugin.enable(profile);

		const Component = () => {
			const { fetchPluginPackages, allPlugins } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					<ul>
						{allPlugins.map((pkg) => (
							<li key={pkg.name()}>{pkg.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(3));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should install plugin from provider", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:install") {
				return "/plugins/test-plugin";
			}

			if (channel === "plugin:loader-fs.find") {
				return {
					config: { name: "test-plugin", version: "0.0.1", keywords: ["@arkecosystem", "desktop-wallet"] },
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
					dir: "/plugins/test-plugin",
				};
			}
		});

		const Component = () => {
			const { fetchPluginPackages, allPlugins, installPlugin } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Fetch</button>
					<ul>
						{allPlugins.map((pkg) => (
							<li key={pkg.name()}>
								<span>{pkg.name()}</span>
								<button onClick={() => installPlugin("/plugins/temp/test-plugin", pkg.name())}>
									Install
								</button>
							</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(2));

		fireEvent.click(screen.getAllByText("Install")[0]);

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:install", {
				name: "@dated/transaction-export-plugin",
				savedPath: "/plugins/temp/test-plugin",
			}),
		);

		await waitFor(() => expect(manager.plugins().findById("test-plugin")).toBeTruthy());

		ipcRendererSpy.mockRestore();
	});

	it("should download plugin from custom url", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:loader-fs.find") {
				return {
					config: { name: "test-plugin", version: "0.0.1", keywords: ["@arkecosystem", "desktop-wallet"] },
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
					dir: "/plugins/test-plugin",
				};
			}

			if (channel === "plugin:download") {
				return "/plugins/test-plugin";
			}
		});

		const Component = () => {
			const { downloadPlugin } = usePluginManagerContext();
			return (
				<div>
					<button
						onClick={() => downloadPlugin("test-plugin", "https://github.com/arkecosystem/test-plugin")}
					>
						Fetch
					</button>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "test-plugin",
				url: "https://github.com/arkecosystem/test-plugin/archive/master.zip",
			}),
		);

		ipcRendererSpy.mockRestore();
	});

	it("should render properly for remote package", async () => {
		nock("https://github.com/")
			.get("/arkecosystem/remote-plugin/raw/master/package.json")
			.reply(200, { name: "remote-plugin", keywords: ["@arkecosystem", "desktop-wallet"] });

		const Component = () => {
			const { fetchLatestPackageConfiguration, pluginConfigurations } = usePluginManagerContext();
			return (
				<>
					<button
						onClick={() => fetchLatestPackageConfiguration("https://github.com/arkecosystem/remote-plugin")}
					>
						Fetch Package
					</button>
					<ul>
						{pluginConfigurations.map((item) => (
							<li key={item.id()}>{item.name()}</li>
						))}
					</ul>
				</>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByText("Fetch Package"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));
	});

	it("should map config to plugin data", () => {
		const config = PluginConfigurationData.make({ name: "my-plugin" });

		const Component = () => {
			const { mapConfigToPluginData } = usePluginManagerContext();
			const pluginData = mapConfigToPluginData(profile, config);

			return <span>{pluginData.name}</span>;
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		expect(screen.getByText("my-plugin")).toBeInTheDocument();
	});

	it("should check if plugin update is available", async () => {
		const plugin = new PluginController(
			{
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
				"desktop-wallet": { minimumVersion: "4.0.0" },
			},
			() => void 0,
		);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, allPlugins, mapConfigToPluginData } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			const pluginDatas = allPlugins.map(mapConfigToPluginData.bind(null, profile));

			return (
				<div>
					<button onClick={onClick}>Click</button>
					<ul>
						{pluginDatas.map((pkg) => (
							<li key={pkg.id}>{pkg.hasUpdateAvailable ? "Update Available" : "No"}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByText("Click"));

		await waitFor(() => expect(screen.getByText("Update Available")).toBeInTheDocument());
	});

	it("should update plugin", async () => {
		jest.useFakeTimers();
		const plugin = new PluginController(
			{
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
				"desktop-wallet": { minimumVersion: "4.0.0" },
			},
			() => void 0,
		);
		manager.plugins().push(plugin);

		const onSpy = jest.spyOn(ipcRenderer, "on").mockImplementation((channel, listener) => {
			if (channel === "plugin:download-progress") {
				return listener(undefined, { totalBytes: 200, percent: 1, transferredBytes: 200 });
			}
		});

		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:install") {
				return "/plugins/test-plugin";
			}

			if (channel === "plugin:loader-fs.find") {
				return {
					config: {
						name: "@dated/transaction-export-plugin",
						version: "1.0.1",
						keywords: ["@arkecosystem", "desktop-wallet"],
					},
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
					dir: "/plugins/test-plugin",
				};
			}

			if (channel === "plugin:download") {
				return "/plugins/temp/test-plugin";
			}
		});

		const Component = () => {
			const { fetchPluginPackages, allPlugins, updatePlugin, hasUpdateAvailable } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Fetch</button>
					<ul>
						{allPlugins.map((pkg) => (
							<li key={pkg.name()}>
								<span>{pkg.name()}</span>
								{hasUpdateAvailable(pkg.id()) ? <span>Update Available</span> : null}
								<button onClick={() => updatePlugin(pkg.name())}>Update</button>
							</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() => expect(screen.getByText("Update Available")).toBeInTheDocument());

		fireEvent.click(screen.getAllByText("Update")[0]);

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenCalledWith("plugin:download", {
				name: "@dated/transaction-export-plugin",
				url: "https://github.com/dated/transaction-export-plugin/archive/master.zip",
			}),
		);

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenCalledWith("plugin:install", {
				name: "@dated/transaction-export-plugin",
				savedPath: "/plugins/temp/test-plugin",
			}),
		);

		await waitFor(() =>
			expect(manager.plugins().findById("@dated/transaction-export-plugin")?.config().version()).toBe("1.0.1"),
		);

		ipcRendererSpy.mockRestore();
		onSpy.mockRestore();
		jest.useRealTimers();
	});

	it("should filter packages", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, allPlugins, filterBy } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{allPlugins.length > 0 && (
						<div
							onClick={() => {
								filterBy({ query: "test" });
							}}
							data-testid="QueryByText"
						/>
					)}

					<ul>
						{allPlugins.map((pkg) => (
							<li key={pkg.name()}>{pkg.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(3));

		fireEvent.click(screen.getByTestId("QueryByText"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should reset filters", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, pluginPackages, filterBy, resetFilters } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								filterBy({ query: "Transaction export" });
							}}
							data-testid="QueryByText"
						/>
					)}

					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								resetFilters();
							}}
							data-testid="ResetFilters"
						/>
					)}
					<ul>
						{pluginPackages.map((pkg) => (
							<li key={pkg.name()}>{pkg.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<Component />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(2));

		fireEvent.click(screen.getByTestId("QueryByText"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));

		fireEvent.click(screen.getByTestId("ResetFilters"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(2));

		manager.plugins().removeById(plugin.config().id(), profile);
	});
});
