import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { ipcRenderer } from "electron";
import nock from "nock";
import {
	LaunchPluginService,
	PluginController,
	PluginManager,
	PluginManagerProvider,
	usePluginManagerContext,
} from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { toasts } from "../../../../app/services";
import { translations } from "../../i18n";
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
			.reply(200, { name: "remote-plugin", keywords: ["@arkecosystem", "desktop-wallet"] });

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
			})
			.get("/dated/delegate-calculator-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/delegate-calculator-plugin.json"));

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

	it("should report plugin", async () => {
		const ipcRendererMock = jest.spyOn(ipcRenderer, "send").mockImplementation();

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

		fireEvent.click(screen.getByTestId("PluginHeader__button--report"));

		expect(ipcRendererMock).toHaveBeenCalledWith(
			"open-external",
			"https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test-plugin&plugin_version=0.0.0",
		);

		ipcRendererMock.mockRestore();
	});

	it("should open the plugin view", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { permissions: ["LAUNCH"] } },
			(api) => api.launch().render(<h1>Test</h1>),
		);
		manager.services().register([new LaunchPluginService()]);
		manager.plugins().push(plugin);
		plugin.enable(profile, { autoRun: true });

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

		fireEvent.click(screen.getByTestId("PluginHeader__button--launch"));

		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/plugins/view`);
		expect(history.location.search).toEqual(`?pluginId=${plugin.config().id()}`);

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should enable package from header", async () => {
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

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.ENABLE));

		await waitFor(() => expect(plugin.isEnabled(profile)).toBe(true));

		manager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should disable package from header", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { categories: ["exchange"] } },
			() => void 0,
		);

		manager.plugins().push(plugin);
		plugin.enable(profile, { autoRun: true });

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

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.DISABLE));

		await waitFor(() => expect(plugin.isEnabled(profile)).toBe(false));
		manager.plugins().removeById(plugin.config().id(), profile);
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

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.DELETE));

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(manager.plugins().findById(plugin.config().id())).toBeUndefined());
		await waitFor(() => expect(history.location.pathname).toBe(`/profiles/${profile.id()}/plugins`));

		invokeMock.mockRestore();
	});

	it("should close remove confirmation", async () => {
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

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.DELETE));

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__cancel-button"));
		await waitFor(() => expect(screen.queryByTestId("PluginUninstallConfirmation")).not.toBeInTheDocument());

		invokeMock.mockRestore();
	});

	it("should install package", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:loader-fs.find") {
				return {
					config: { name: "remote-plugin", version: "0.0.1", keywords: ["@arkecosystem", "desktop-wallet"] },
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

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		fireEvent.click(screen.getByTestId("InstallPlugin__download-button"));

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "remote-plugin",
				url: "https://github.com/arkecosystem/remote-plugin/archive/master.zip",
			}),
		);
	});

	it("should install package with error", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:download") {
				throw new Error("Plugin not found");
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

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		fireEvent.click(screen.getByTestId("InstallPlugin__download-button"));

		const toastSpy = jest.spyOn(toasts, "error");

		await waitFor(() => expect(toastSpy).toHaveBeenCalled());
	});

	it("should update package", async () => {
		jest.useFakeTimers();
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockRejectedValue("Failed");

		const plugin = new PluginController(
			{
				name: "@dated/transaction-export-plugin",
				version: "1.0.0",
				"desktop-wallet": { minimumVersion: "4.0.0" },
			},
			() => void 0,
		);
		manager.plugins().push(plugin);

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

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));

		await waitFor(() => expect(screen.getByText(commonTranslations.UPDATE)).toBeInTheDocument());
		fireEvent.click(screen.getByText(commonTranslations.UPDATE));

		await waitFor(() => expect(ipcRendererSpy).toHaveBeenCalled());

		expect(container).toMatchSnapshot();
		jest.useRealTimers();
	});
});
