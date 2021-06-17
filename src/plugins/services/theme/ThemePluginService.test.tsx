import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import React from "react";
import { env, render, screen } from "utils/testing-library";

import { ThemePluginService } from "./ThemePluginService";
import { withThemeDecorator } from "./withThemeDecorator";

const config = { name: "test", version: "1.1", "desktop-wallet": { permissions: ["THEME"] } };

describe("ThemePluginService", () => {
	let profile: Contracts.IProfile;
	let manager: PluginManager;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();

		manager.services().register([new ThemePluginService()]);
		manager.services().boot();
	});

	it("should override components when enabled", () => {
		const fixture = (api: PluginAPI) => {
			const MyButton = (properties: any) => <span data-testid="plugin-button" {...properties} />;
			api.theme().decorate("test.button", () => MyButton);
		};

		const ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);

		const Button = (properties: any) => <button data-testid="app-button" {...properties} />;
		const ThemedButton = withThemeDecorator("test.button", Button, manager);

		const { rerender } = render(<ThemedButton>Hello</ThemedButton>);

		expect(screen.queryByTestId("app-button")).toHaveTextContent("Hello");
		expect(screen.queryByTestId("plugin-button")).toBeNull();

		// Run plugins
		manager.plugins().runAllEnabled(profile);

		rerender(<ThemedButton>Hello</ThemedButton>);

		expect(screen.queryByTestId("plugin-button")).toHaveTextContent("Hello");
		expect(screen.queryByTestId("app-button")).toBeNull();
	});
});
