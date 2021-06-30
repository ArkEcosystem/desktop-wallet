import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EnvironmentProvider } from "app/contexts";
import electron, { ipcRenderer } from "electron";
import nock from "nock";
import { PluginController, PluginManager } from "plugins/core";
import { PluginConfigurationData } from "plugins/core/configuration";
import React, { useState } from "react";
import { act, env, getDefaultProfileId } from "utils/testing-library";

import { PluginManagerProvider, usePluginManagerContext } from "./PluginManagerProvider";

describe("PluginManagerProvider", () => {
	let manager: PluginManager;
	let profile: Contracts.IProfile;

	beforeAll(() => {
		nock("https://registry.npmjs.com")
			.get("/-/v1/search")
			.query((parameters) => parameters.from === "0")
			.once()
			.reply(200, require("tests/fixtures/plugins/registry-response.json"))
			.get("/-/v1/search")
			.query((parameters) => parameters.from === "250")
			.once()
			.reply(200, {})
			.persist();

		nock("https://raw.github.com")
			.get("/dated/transaction-export-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/transaction-export-plugin.json"))
			.get("/dated/delegate-calculator-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/delegate-calculator-plugin.json"))
			.get("/ark-ecosystem-desktop-plugins/sound-notifications/master/package.json")
			.reply(
				200,
				require("tests/fixtures/plugins/github/@arkecosystem/desktop-wallet-sound-notifications/package.json"),
			)
			.get("/ark-ecosystem-desktop-plugins/explorer/master/package.json")
			.reply(200, require("tests/fixtures/plugins/github/@arkecosystem/desktop-wallet-explorer/package.json"))
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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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
						{allPlugins.map((package_) => (
							<li key={package_.name()}>{package_.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(5));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should install plugin from provider", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:install") {
				return "/plugins/test-plugin";
			}

			if (channel === "plugin:loader-fs.find") {
				return {
					config: { keywords: ["@arkecosystem", "desktop-wallet"], name: "test-plugin", version: "0.0.1" },
					dir: "/plugins/test-plugin",
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
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
						{allPlugins.map((package_) => (
							<li key={package_.name()}>
								<span>{package_.name()}</span>
								<button onClick={() => installPlugin("/plugins/temp/test-plugin", package_.name())}>
									Install
								</button>
							</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(4));

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
					config: { keywords: ["@arkecosystem", "desktop-wallet"], name: "test-plugin", version: "0.0.1" },
					dir: "/plugins/test-plugin",
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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
			.reply(200, { keywords: ["@arkecosystem", "desktop-wallet"], name: "remote-plugin" });

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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		expect(screen.getByText("my-plugin")).toBeInTheDocument();
	});

	it("should check if plugin update is available", async () => {
		const plugin = new PluginController(
			{
				"desktop-wallet": { minimumVersion: "4.0.0" },
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
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
						{pluginDatas.map((package_) => (
							<li key={package_.id}>{package_.hasUpdateAvailable ? "Update Available" : "No"}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByText("Click"));

		await waitFor(() => expect(screen.getByText("Update Available")).toBeInTheDocument());
	});

	it("should update plugin", async () => {
		jest.useFakeTimers();
		const plugin = new PluginController(
			{
				"desktop-wallet": { minimumVersion: "4.0.0" },
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
			},
			() => void 0,
		);
		manager.plugins().push(plugin);

		const onSpy = jest.spyOn(ipcRenderer, "on").mockImplementation((channel, listener) => {
			if (channel === "plugin:download-progress") {
				listener(undefined, {
					name: plugin.config().name(),
					percent: 1,
					totalBytes: 200,
					transferredBytes: 200,
				});
				listener(undefined, { name: "other-plugin", percent: 1, totalBytes: 200, transferredBytes: 200 });
			}
		});

		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:install") {
				return "/plugins/test-plugin";
			}

			if (channel === "plugin:loader-fs.find") {
				return {
					config: {
						keywords: ["@arkecosystem", "desktop-wallet"],
						name: "@dated/transaction-export-plugin",
						version: "1.0.1",
					},
					dir: "/plugins/test-plugin",
					source: () => void 0,
					sourcePath: "/plugins/test-plugin/index.js",
				};
			}

			if (channel === "plugin:download") {
				return "/plugins/temp/test-plugin";
			}
		});

		const Component = () => {
			const {
				fetchPluginPackages,
				allPlugins,
				updatePlugin,
				hasUpdateAvailable,
				updatingStats,
			} = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Fetch</button>
					<ul>
						{allPlugins.map((package_) => (
							<li key={package_.name()}>
								<span>{package_.name()}</span>
								{updatingStats[package_.name()]?.completed ? (
									<span>Update Completed</span>
								) : hasUpdateAvailable(package_.id()) ? (
									<span>Update Available</span>
								) : null}
								<button onClick={() => updatePlugin(package_.name())}>Update</button>
							</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
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

		act(() => {
			jest.runOnlyPendingTimers();
		});

		await waitFor(() => expect(screen.getByText("Update Completed")).toBeInTheDocument());

		ipcRendererSpy.mockRestore();
		onSpy.mockRestore();
		jest.useRealTimers();
	});

	it("should handle and exception while updating a plugin", async () => {
		jest.useFakeTimers();

		const plugin = new PluginController(
			{
				"desktop-wallet": { minimumVersion: "4.0.0" },
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
			},
			() => void 0,
		);
		manager.plugins().push(plugin);

		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:install") {
				throw new Error();
			}
		});

		const Component = () => {
			const {
				fetchPluginPackages,
				allPlugins,
				updatePlugin,
				hasUpdateAvailable,
				updatingStats,
			} = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Fetch</button>
					<ul>
						{allPlugins.map((package_) => (
							<li key={package_.name()}>
								<span>{package_.name()}</span>
								{updatingStats[package_.name()]?.failed ? (
									<span>Updated failed</span>
								) : (
									<>
										{hasUpdateAvailable(package_.id()) ? <span>Update Available</span> : null}
										<button onClick={() => updatePlugin(package_.name())}>Update</button>
									</>
								)}
							</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByText("Fetch"));

		await waitFor(() => expect(screen.getByText("Update Available")).toBeInTheDocument());

		fireEvent.click(screen.getAllByText("Update")[0]);

		await waitFor(() =>
			expect(manager.plugins().findById("@dated/transaction-export-plugin")?.config().version()).toBe("1.0.0"),
		);

		expect(screen.getAllByText("Updated failed")).toBeTruthy();

		ipcRendererSpy.mockRestore();
		jest.useRealTimers();
	});

	it("should filter packages", async () => {
		const plugin = new PluginController({ name: "my-custom-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, searchResults, filterBy } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{searchResults.length > 0 && (
						<div
							onClick={() => {
								filterBy({ query: "custom" });
							}}
							data-testid="QueryByText"
						/>
					)}

					<ul>
						{searchResults.map((package_) => (
							<li key={package_.name()}>{package_.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(5));

		fireEvent.click(screen.getByTestId("QueryByText"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should reset filters", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, searchResults, filterBy, resetFilters } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{searchResults.length > 0 && (
						<div
							onClick={() => {
								filterBy({ query: "Transaction export" });
							}}
							data-testid="QueryByText"
						/>
					)}

					{searchResults.length > 0 && (
						<div
							onClick={() => {
								resetFilters();
							}}
							data-testid="ResetFilters"
						/>
					)}
					<ul>
						{searchResults.map((package_) => (
							<li key={package_.name()}>{package_.name()}</li>
						))}
					</ul>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(5));

		fireEvent.click(screen.getByTestId("QueryByText"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));

		fireEvent.click(screen.getByTestId("ResetFilters"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(5));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should fetch plugin size", async () => {
		const Component = () => {
			const { fetchPluginPackages, fetchSize, pluginPackages } = usePluginManagerContext();
			const [size, setSize] = useState<string>();

			return (
				<div>
					<button onClick={() => fetchPluginPackages()}>Fetch Plugins</button>
					<button onClick={() => fetchSize(pluginPackages?.[0]?.id()).then(setSize)}>Fetch Size</button>
					<span>Plugins {pluginPackages.length}</span>
					<span>Size {size || "N/A"}</span>
				</div>
			);
		};

		render(
			<EnvironmentProvider env={env}>
				<PluginManagerProvider manager={manager} services={[]}>
					<Component />
				</PluginManagerProvider>
			</EnvironmentProvider>,
		);

		fireEvent.click(screen.getByText("Fetch Size"));
		expect(screen.getByText("Size N/A")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Fetch Plugins"));
		await waitFor(() => expect(screen.getByText("Plugins 4")).toBeInTheDocument());

		fireEvent.click(screen.getByText("Fetch Size"));
		await waitFor(() => expect(screen.getByText("Size 304 kB")).toBeInTheDocument());
	});
});
