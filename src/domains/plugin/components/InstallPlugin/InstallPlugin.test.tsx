/* eslint-disable @typescript-eslint/require-await */

import { ipcRenderer } from "electron";
import { PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { fireEvent, render, waitFor } from "utils/testing-library";

import { InstallPlugin } from "./InstallPlugin";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

describe("InstallPlugin", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<PluginManagerProvider manager={new PluginManager()} services={[]}>
				<InstallPlugin isOpen={false} />
			</PluginManagerProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 1st step", async () => {
		const { getByTestId, asFragment } = render(
			<FirstStep plugin={{ permissions: ["PROFILE", "EVENTS", "HTTP"] }} />,
		);

		expect(getByTestId("InstallPlugin__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step with partial download progress", async () => {
		const { getByTestId, asFragment } = render(
			<SecondStep plugin={{ title: "My Plugin", size: "0 B" }} downloadProgress={{ totalBytes: 100 }} />,
		);

		expect(getByTestId("InstallPlugin__step--second__progress")).toHaveTextContent("0 B / 100 B");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step with full download progress", async () => {
		const { getByTestId, asFragment } = render(
			<SecondStep
				plugin={{ title: "My Plugin", logo: "https://ark.io/logo.png", size: "100 B" }}
				downloadProgress={{ totalBytes: 100, percent: 1, transferredBytes: 100 }}
			/>,
		);

		expect(getByTestId("InstallPlugin__step--second__progress")).toHaveTextContent("100 B / 100 B");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3st step", async () => {
		const { getByTestId, asFragment } = render(<ThirdStep plugin={{ title: "My Plugin" }} />);

		expect(getByTestId("InstallPlugin__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3st step with plugin logo", async () => {
		const { getByTestId, asFragment } = render(
			<ThirdStep plugin={{ title: "My Plugin", logo: "https://ark.io/logo.png" }} />,
		);

		expect(getByTestId("InstallPlugin__step--third__logo")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should download and install plugin", async () => {
		const onSpy = jest.spyOn(ipcRenderer, "on").mockImplementation((channel, listener) => {
			if (channel === "plugin:download-progress") {
				return listener(undefined, { totalBytes: 200 });
			}
		});

		const invokeSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:loader-fs.find") {
				return {
					config: { name: "remote-plugin", version: "0.0.1", keywords: ["@arkecosystem", "desktop-wallet"] },
					source: () => void 0,
					sourcePath: "/plugins/remote-plugin/index.js",
					dir: "/plugins/remote-plugin",
				};
			}

			if (channel === "plugin:install") {
				return "/Users/plugins/remote-plugin";
			}

			if (channel === "plugin:download") {
				return "/Users/plugins/temp/remote-plugin";
			}
		});
		const onClose = jest.fn();

		const { container, getByTestId } = render(
			<PluginManagerProvider manager={new PluginManager()} services={[]}>
				<InstallPlugin
					repositoryURL="https://github.com/my-plugin"
					isOpen={true}
					plugin={{ id: "remote-plugin", title: "Remote Plugin", permissions: ["PROFILE"] }}
					onClose={onClose}
				/>
			</PluginManagerProvider>,
		);

		fireEvent.click(getByTestId("InstallPlugin__download-button"));

		await waitFor(() => expect(getByTestId("InstallPlugin__step--second")).toBeInTheDocument());

		expect(invokeSpy).toHaveBeenLastCalledWith("plugin:download", {
			name: "remote-plugin",
			url: "https://github.com/my-plugin/archive/master.zip",
		});

		await waitFor(() => expect(getByTestId("InstallPlugin__step--third")).toBeInTheDocument());

		fireEvent.click(getByTestId("InstallPlugin__install-button"));

		expect(invokeSpy).toHaveBeenLastCalledWith("plugin:install", {
			name: "remote-plugin",
			savedPath: "/Users/plugins/temp/remote-plugin",
		});

		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});
});
