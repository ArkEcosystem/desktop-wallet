import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { Settings } from "./Settings";

describe("Settings", () => {
	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<Settings />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render peer settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(<Settings />);

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Peer"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(<Settings />);

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Plugins"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close modals in the plugin settings", async () => {
		const { container, asFragment, getByTestId, findByText } = renderWithRouter(<Settings />);

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Plugins"));
		expect(asFragment()).toMatchSnapshot();

		// Open `BlacklistPlugins` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__open-list"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_BLACKLIST_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Open `AddBlacklistPlugin` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__add-plugin"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});
});
