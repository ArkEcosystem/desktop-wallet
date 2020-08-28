import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginCard } from "./PluginCard";

const basePlugin = {
	id: "ark-explorer",
	name: "ARK Explorer",
	author: "ARK.io",
	category: "utility",
	rating: 4.2,
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

		expect(await findByText(plugin.name)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger view", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onClick = jest.fn();

		const { asFragment, findByText, getByTestId } = render(<PluginCard plugin={plugin} onClick={onClick} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.VIEW));

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onDelete = jest.fn();

		const { asFragment, findByText, getByTestId } = render(<PluginCard plugin={plugin} onDelete={onDelete} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalledTimes(1);
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
