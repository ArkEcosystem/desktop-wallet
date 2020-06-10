import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Settings } from "../";

describe("Settings", () => {
	it("should render", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Wallet Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"General"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a not found information", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Wallet Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"Peer"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
