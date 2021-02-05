import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { toasts } from "app/services";
import nock from "nock";
import { PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { PluginManualInstallModal } from "./PluginManualInstallModal";

describe("PluginManualInstallModal", () => {
	let profile: Profile;
	let manager: PluginManager;

	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	it("should render properly", async () => {
		nock("https://github.com/")
			.get("/arkecosystem/fail-plugin/raw/master/package.json")
			.replyWithError("Failed")
			.get("/arkecosystem/test-plugin/raw/master/package.json")
			.reply(200, { name: "test-plugin", keywords: ["@arkecosystem", "desktop-wallet"] });

		const toastSpy = jest.spyOn(toasts, "error").mockImplementation();

		const onSuccess = jest.fn();
		const { container } = render(
			<PluginManagerProvider manager={manager} services={[]}>
				<PluginManualInstallModal onSuccess={onSuccess} isOpen />
			</PluginManagerProvider>,
		);

		expect(screen.queryByTestId("PluginManualInstallModal__submit-button")).toBeDisabled();

		fireEvent.input(screen.getByRole("textbox"), { target: { value: "https://" } });

		expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");

		fireEvent.input(screen.getByRole("textbox"), {
			target: { value: "https://github.com/arkecosystem/fail-plugin" },
		});
		fireEvent.click(screen.getByTestId("PluginManualInstallModal__submit-button"));
		await waitFor(() => expect(toastSpy).toHaveBeenCalled());

		fireEvent.input(screen.getByRole("textbox"), {
			target: { value: "https://github.com/arkecosystem/test-plugin" },
		});
		fireEvent.click(screen.getByTestId("PluginManualInstallModal__submit-button"));
		await waitFor(() =>
			expect(onSuccess).toHaveBeenCalledWith({
				pluginId: "test-plugin",
				repositoryURL: "https://github.com/arkecosystem/test-plugin",
			}),
		);

		expect(container).toMatchSnapshot();
	});
});
