import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import electron, { ipcRenderer } from "electron";
import nock from "nock";
import { PluginController, PluginManager } from "plugins/core";
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

		const Component = () => {
			const { fetchPluginPackages, pluginPackages } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
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
			const { fetchPluginPackages, pluginPackages, installPlugin } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Fetch</button>
					<ul>
						{pluginPackages.map((pkg) => (
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

		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(1));

		fireEvent.click(screen.getByText("Install"));

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

	it("should filter packages by search query", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, pluginPackages, filterBy } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								filterBy({ query: "test" });
							}}
							data-testid="QueryByText"
						/>
					)}

					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								filterBy({ categories: ["utility"] });
							}}
							data-testid="QueryByUnknownText"
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

		fireEvent.click(screen.getByTestId("QueryByUnknownText"));
		await waitFor(() => expect(() => screen.getAllByRole("listitem")).toThrow());

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should filter by category", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0);
		manager.plugins().push(plugin);

		const Component = () => {
			const { fetchPluginPackages, pluginPackages, filterBy } = usePluginManagerContext();
			const onClick = () => fetchPluginPackages();
			return (
				<div>
					<button onClick={onClick}>Click</button>
					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								filterBy({ categories: [] });
							}}
							data-testid="QueryByCategory"
						/>
					)}

					{pluginPackages.length > 0 && (
						<div
							onClick={() => {
								filterBy({ categories: ["unnkown"] });
							}}
							data-testid="QueryByUnknownCategory"
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

		fireEvent.click(screen.getByTestId("QueryByCategory"));
		await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(2));

		fireEvent.click(screen.getByTestId("QueryByUnknownCategory"));
		await waitFor(() => expect(() => screen.getAllByRole("listitem")).toThrow());

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
								filterBy({ query: "test" });
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
