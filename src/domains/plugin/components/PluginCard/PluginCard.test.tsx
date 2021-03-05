import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginCard } from "./PluginCard";

const basePlugin = {
	id: "ark-explorer",
	title: "ARK Explorer",
	author: "ARK.io",
	category: "utility",
	version: "1.3.8",
	size: "4.2 MB",
};

describe("PluginCard", () => {
	it("should render", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
		};

		const { asFragment, findByText } = render(<PluginCard plugin={plugin} />);

		expect(await findByText(plugin.title)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without category", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
		};

		const { asFragment, findByText } = render(<PluginCard plugin={plugin} showCategory={false} />);

		expect(await findByText(plugin.title)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger view", () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onClick = jest.fn();

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} onClick={onClick} />);

		fireEvent.click(getByTestId("Card"));

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render official icon", () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
			isOfficial: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("official-ark-plugin.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render grant icon", () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
			isGrant: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("grant.svg");
		expect(asFragment()).toMatchSnapshot();
	});
});
