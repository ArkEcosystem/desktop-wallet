import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { ipcRenderer } from "electron";
import { PluginController, PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { PluginUninstallConfirmation } from "./PluginUninstallConfirmation";

describe("Plugin Uninstall Confirmation", () => {
	let profile: Profile;
	let manager: PluginManager;

	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	it("should remove the plugin", async () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0, "/plugins/example");
		manager.plugins().push(plugin);

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);

		const onDelete = jest.fn();

		const { container } = render(
			<PluginManagerProvider manager={manager} services={[]}>
				<PluginUninstallConfirmation profile={profile} plugin={plugin} onDelete={onDelete} isOpen />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(invokeMock).toHaveBeenLastCalledWith("plugin:loader-fs.remove", "/plugins/example"));
		await waitFor(() => expect(manager.plugins().findById(plugin.config().id())).toBeFalsy());

		expect(onDelete).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	it("should close on cancel", () => {
		const plugin = new PluginController({ name: "test-plugin" }, () => void 0, "/plugins/example");
		manager.plugins().push(plugin);

		const onClose = jest.fn();

		render(
			<PluginManagerProvider manager={manager} services={[]}>
				<PluginUninstallConfirmation profile={profile} plugin={plugin} onClose={onClose} isOpen />
			</PluginManagerProvider>,
		);

		fireEvent.click(screen.getByTestId("PluginUninstall__cancel-button"));

		expect(onClose).toHaveBeenCalled();
	});
});
