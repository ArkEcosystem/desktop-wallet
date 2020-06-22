import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { Settings } from "./Settings";

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

	it("should render peer settings", () => {
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
				title: "Peer Settings",
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

	it("should render plugin settings", () => {
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
				title: "Plugin Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"Plugins"} setActiveSettings={() => null} {...settingsProps} />,
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
			{
				itemKey: "Foo",
				label: "Foo",
				icon: "Foo",
				route: "/settings/foo",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Wallet Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"Foo"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
