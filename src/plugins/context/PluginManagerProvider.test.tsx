import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import electron from "electron";
import { PluginController, PluginManager } from "plugins/core";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { PluginManagerProvider, usePluginManagerContext } from "./PluginManagerProvider";

describe("PluginManagerProvider", () => {
	let manager: PluginManager;
	let profile: Profile;

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
			const onClick = () => reportPlugin(plugin);
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
			"https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test-plugin&plugin_version=undefined",
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
});
